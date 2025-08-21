# DevOps Ecosystem

Kita akan memecah proyek ini menjadi 5 fase, dari nol hingga memiliki aplikasi yang berjalan dengan pipeline CI/CD, monitoring, dan rencana pemulihan bencana.

**Studi Kasus:**

- **Aplikasi Frontend:** Vuetify + Vite (Web) berjalan di **Port 80**.
- **Aplikasi Backend:** NestJS (API) berjalan di **Port 5000**.
- **Deployment Target:** 1 OCI Compute Instance (VM) "Always Free".
- **Otomatisasi:** GitHub Actions.

Mari kita mulai!

### Fase 1: Membangun Fondasi dengan Infrastructure as Code (Terraform)

Di fase ini, kita akan mendefinisikan seluruh infrastruktur (jaringan dan server) dalam bentuk kode. Ini memungkinkan kita membangun ulang semuanya dengan satu perintah—konsep inti dari "CODE as Infrastructure" yang ditekankan dosen Anda.

#### Langkah 1.1: Persiapan Awal di OCI & Komputer Lokal

1. **Buat Akun OCI Always Free:** Jika belum, daftar di [situs Oracle Cloud](https://www.oracle.com/cloud/free/).

1. **Install Terraform:** Unduh dan install Terraform di komputer Anda dari [situs resmi Terraform](https://www.terraform.io/downloads.html).

1. **Siapkan Kunci API OCI:** Ini penting agar Terraform bisa berkomunikasi dengan akun OCI Anda.

   - Login ke konsol OCI.
   - Klik ikon Profil Anda di pojok kanan atas > **User Settings**.
   - Di sisi kiri, pilih **API Keys**, lalu klik **Add API Key**.
   - Pilih **Generate API Key Pair**. Unduh _private key_ dan simpan di lokasi aman (misal: `~/.oci/oci_api_key.pem`).
   - Salin teks konfigurasi yang muncul di jendela pop-up.

1. **Buat File Konfigurasi OCI:**

   - Di komputer Anda, buat folder `~/.oci/`.
   - Buat file bernama `config` di dalam folder tersebut.
   - Tempelkan teks konfigurasi yang Anda salin dari langkah sebelumnya ke dalam file ini. Edit path ke `key_file` agar sesuai dengan lokasi Anda menyimpan private key.

   <!-- end list -->

   ```ini
   [DEFAULT]
   user=ocid1.user.oc1..xxxxx
   fingerprint=xx:xx:xx:xx:xx:xx
   tenancy=ocid1.tenancy.oc1..xxxxx
   region=ap-jakarta-1
   key_file=C:/Users/YourUser/.oci/oci_api_key.pem # <-- GANTI DENGAN PATH ANDA
   ```

1. **Siapkan Kunci SSH:** Ini digunakan untuk mengakses VM Anda. Jika belum punya, buat dengan perintah:

   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/oci_vm_key
   ```

   Ini akan membuat dua file: `oci_vm_key` (private key) dan `oci_vm_key.pub` (public key).

#### Langkah 1.2: Menulis Kode Terraform

Buat folder baru untuk proyek Anda, dan di dalamnya, buat file bernama `main.tf`. Salin semua kode di bawah ini ke dalam file tersebut.

**File: `main.tf`**

```terraform
# ============== PROVIDER & VARIABLES ==============
provider "oci" {
  region = "ap-jakarta-1" # Ganti dengan Home Region Anda jika berbeda
}

variable "compartment_ocid" {
  description = "OCID dari Compartment tempat resource akan dibuat"
  # Dapatkan dari konsol OCI: Identity & Security -> Compartments
}

variable "ssh_public_key" {
  description = "Isi dari file public key SSH Anda (oci_vm_key.pub)"
}

# ============== NETWORK ==============
# Virtual Cloud Network (VCN)
resource "oci_core_vcn" "devops_vcn" {
  compartment_id = var.compartment_ocid
  cidr_block     = "10.0.0.0/16"
  display_name   = "DevOps_VCN"
}

# Internet Gateway
resource "oci_core_internet_gateway" "devops_igw" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.devops_vcn.id
  display_name   = "DevOps_IGW"
}

# Route Table untuk akses internet
resource "oci_core_route_table" "devops_route_table" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.devops_vcn.id
  display_name   = "DevOps_Route_Table"
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.devops_igw.id
  }
}

# Subnet Publik
resource "oci_core_subnet" "devops_subnet" {
  compartment_id     = var.compartment_ocid
  vcn_id             = oci_core_vcn.devops_vcn.id
  cidr_block         = "10.0.1.0/24"
  display_name       = "DevOps_Public_Subnet"
  route_table_id     = oci_core_route_table.devops_route_table.id
  security_list_ids  = [oci_core_security_list.devops_security_list.id]
  prohibit_public_ip_on_vnic = false
}

# Security List (Firewall)
resource "oci_core_security_list" "devops_security_list" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.devops_vcn.id
  display_name   = "DevOps_Security_List"

  # Aturan masuk (Ingress)
  ingress_security_rules {
    protocol  = "6" # TCP
    source    = "0.0.0.0/0"
    stateless = false
    # Port untuk SSH
    tcp_options {
      min = 22
      max = 22
    }
  }
  ingress_security_rules {
    protocol  = "6" # TCP
    source    = "0.0.0.0/0"
    stateless = false
    # Port untuk WEB (Vuetify)
    tcp_options {
      min = 80
      max = 80
    }
  }
  ingress_security_rules {
    protocol  = "6" # TCP
    source    = "0.0.0.0/0"
    stateless = false
    # Port untuk API (NestJS)
    tcp_options {
      min = 5000
      max = 5000
    }
  }

  # Aturan keluar (Egress) - Izinkan semua
  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
    stateless   = false
  }
}

# ============== COMPUTE INSTANCE (VM) ==============
resource "oci_core_instance" "devops_vm" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  shape               = "VM.Standard.A1.Flex" # Shape Ampere (ARM) Always Free
  display_name        = "DevOps-Server"

  shape_config {
    ocpus         = 2  # Alokasikan 2 dari 4 OCPU gratis Anda
    memory_in_gbs = 12 # Alokasikan 12 dari 24 GB RAM gratis Anda
  }

  source_details {
    source_type = "image"
    # Gunakan OCID image terbaru untuk Oracle Linux 8
    source_id   = "ocid1.image.oc1.ap-jakarta-1.aaaaaaaaz5v7a..." # GANTI dengan image OCID terbaru
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.devops_subnet.id
    assign_public_ip = true
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
  }
}

# ============== DATA & OUTPUTS ==============
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid # Gunakan tenancy OCID dari file config
}

output "vm_public_ip" {
  value = oci_core_instance.devops_vm.public_ip
}
```

#### Langkah 1.3: Menjalankan Terraform

1. **Buat file `terraform.tfvars`:** File ini untuk menyimpan nilai variabel Anda agar tidak perlu mengetiknya setiap saat.

   ```
   compartment_ocid = "ocid1.compartment.oc1..xxxxx" # GANTI DENGAN OCID COMPARTMENT ANDA
   ssh_public_key   = "ssh-rsa AAAA..." # GANTI DENGAN ISI FILE oci_vm_key.pub ANDA
   ```

1. **Inisialisasi Terraform:** Buka terminal di folder proyek Anda dan jalankan:

   ```bash
   terraform init
   ```

1. **Rencanakan Penerapan:** Lihat apa saja yang akan dibuat oleh Terraform.

   ```bash
   terraform plan
   ```

1. **Terapkan Konfigurasi:** Jika rencana sudah sesuai, bangun infrastrukturnya!

   ```bash
   terraform apply --auto-approve
   ```

Tunggu beberapa menit. Setelah selesai, Terraform akan menampilkan **IP Publik** dari VM Anda. Selamat, fondasi Anda sudah berdiri!

### Fase 2: Pengaturan GitHub & Pipeline CI/CD

Sekarang kita siapkan repositori dan otomatisasi agar setiap `git push` bisa men-deploy kode secara otomatis.

#### Langkah 2.1: Siapkan Repositori GitHub

1. Buat repositori baru di GitHub.

1. Struktur folder proyek Anda secara lokal seperti ini:

   ```
   /my-devops-project
   ├── .github/
   │   └── workflows/
   │       └── deploy.yml  <-- File Pipeline CI/CD
   ├── frontend/           <-- Folder untuk kode Vuetify/Vite
   │   └── ...
   ├── backend/            <-- Folder untuk kode NestJS
   │   └── ...
   ├── deploy.sh           <-- Script yang akan dijalankan di server
   └── ... (file terraform Anda)
   ```

1. Push kode awal Anda ke repositori GitHub.

#### Langkah 2.2: Konfigurasi "Secrets" di GitHub

GitHub Actions perlu mengakses VM Anda. Kita akan memberinya akses aman melalui "Secrets".

- Di repositori GitHub Anda, pergi ke **Settings > Secrets and variables > Actions**.
- Buat _repository secrets_ berikut:
  - `VM_HOST`: Isi dengan **IP Publik VM** yang Anda dapat dari Terraform.
  - `VM_USERNAME`: Isi dengan `opc` (user default untuk Oracle Linux).
  - `VM_SSH_KEY`: Buka file private key SSH Anda (`~/.ssh/oci_vm_key`) dengan editor teks, salin **seluruh isinya**, dan tempelkan di sini.

#### Langkah 2.3: Membuat Script Deployment (`deploy.sh`)

Buat file `deploy.sh` di root proyek Anda. Skrip ini berisi semua perintah yang harus dijalankan di server setiap kali ada deployment baru.

**File: `deploy.sh`**

```bash
#!/bin/bash
set -e # Hentikan script jika ada error

echo "==> Memulai proses deployment..."

# Masuk ke direktori proyek
cd /home/opc/my-devops-project

# Tarik perubahan terbaru dari branch main
echo "==> Menarik kode dari GitHub..."
git pull origin main

# --- DEPLOY BACKEND (NESTJS) ---
echo "==> Deploy Backend (NestJS)..."
cd backend

# Install dependencies baru jika ada
echo "--> Install dependencies NestJS..."
npm install

# Build aplikasi NestJS
echo "--> Build NestJS..."
npm run build

# Restart aplikasi menggunakan PM2
echo "--> Restart service API..."
pm2 restart nestjs-api || pm2 start dist/main.js --name "nestjs-api"

echo "==> Backend berhasil di-deploy!"

# --- DEPLOY FRONTEND (VUETIFY) ---
echo "==> Deploy Frontend (Vuetify)..."
cd ../frontend

# Install dependencies baru jika ada
echo "--> Install dependencies Vuetify..."
npm install

# Build aplikasi Vuetify untuk produksi
echo "--> Build Vuetify..."
npm run build

echo "==> Frontend berhasil di-deploy! Nginx akan otomatis menyajikan file baru."
echo "==> DEPLOYMENT SELESAI <=="
```

#### Langkah 2.4: Membuat Workflow GitHub Actions (`deploy.yml`)

Buat file `deploy.yml` di dalam `.github/workflows/`. Ini adalah jantung dari otomatisasi CI/CD Anda.

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to OCI VM

on:
  push:
    branches:
      - main # Jalankan hanya jika ada push ke branch 'main'

jobs:
  deploy:
    runs-on: ubuntu-latest # Runner GitHub

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Deploy to VM via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USERNAME }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            # Pindah ke direktori proyek dan jalankan skrip deployment
            cd /home/opc/my-devops-project
            chmod +x deploy.sh
            ./deploy.sh
```

Sekarang, setiap kali Anda melakukan `git push` ke branch `main`, GitHub Actions akan otomatis SSH ke VM Anda dan menjalankan `deploy.sh`.

### Fase 3: Deployment Aplikasi di VM (Pengaturan Awal)

Sebelum CI/CD bisa berjalan mulus, kita perlu melakukan beberapa pengaturan awal di VM. **Lakukan ini hanya sekali.**

#### Langkah 3.1: Akses VM dan Install Tools

1. Akses VM Anda menggunakan SSH:

   ```bash
   ssh -i ~/.ssh/oci_vm_key opc@<IP_PUBLIK_VM_ANDA>
   ```

1. Install `git`, `nginx`, dan `Node.js` (via `nvm`):

   ```bash
   # Update sistem
   sudo dnf update -y

   # Install Git & Nginx
   sudo dnf install git nginx -y

   # Install NVM (Node Version Manager)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

   # Reload shell agar nvm bisa digunakan
   source ~/.bashrc

   # Install Node.js LTS
   nvm install --lts
   ```

1. Install `pm2` secara global. Ini adalah manajer proses yang akan menjaga API NestJS Anda tetap berjalan.

   ```bash
   npm install pm2 -g
   ```

1. Clone repositori Anda ke VM:

   ```bash
   git clone <URL_GIT_ANDA> /home/opc/my-devops-project
   ```

#### Langkah 3.2: Konfigurasi Nginx sebagai Reverse Proxy

Kita akan konfigurasi Nginx agar:

1. Menyajikan file statis dari hasil build Vuetify di port 80.

1. Meneruskan semua permintaan yang datang ke `/api` ke aplikasi NestJS di port 5000.

1. Edit file konfigurasi Nginx:

   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```

1. Hapus semua isi file tersebut dan ganti dengan konfigurasi di bawah ini:

   ```nginx
   user nginx;
   worker_processes auto;
   error_log /var/log/nginx/error.log;
   pid /run/nginx.pid;

   include /usr/share/nginx/modules/*.conf;

   events {
       worker_connections 1024;
   }

   http {
       include /etc/nginx/mime.types;
       default_type application/octet-stream;

       server {
           listen 80;
           server_name <IP_PUBLIK_VM_ANDA>; # Ganti dengan IP atau domain Anda

           # --- Lokasi untuk API NestJS ---
           # Semua request ke /api/... akan diteruskan ke NestJS
           location /api {
               proxy_pass http://localhost:5000;
               proxy_http_version 1.1;
               proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection 'upgrade';
               proxy_set_header Host $host;
               proxy_cache_bypass $http_upgrade;
           }

           # --- Lokasi untuk Web Vuetify ---
           # Menyajikan file dari folder hasil build
           location / {
               root /home/opc/my-devops-project/frontend/dist;
               try_files $uri $uri/ /index.html;
           }
       }
   }
   ```

1. Simpan file (`Ctrl+X`, `Y`, `Enter`).

1. Aktifkan dan jalankan Nginx:

   ```bash
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

#### Langkah 3.3: Menjalankan Aplikasi Secara Manual (Pertama Kali)

Kita perlu menjalankan aplikasi sekali secara manual agar PM2 bisa mengenali prosesnya.

1. **Backend (NestJS):**

   ```bash
   cd /home/opc/my-devops-project/backend
   npm install
   npm run build
   pm2 start dist/main.js --name "nestjs-api"
   ```

1. **Frontend (Vuetify):**

   ```bash
   cd /home/opc/my-devops-project/frontend
   npm install
   npm run build
   ```

1. **Simpan Proses PM2:** Agar API otomatis berjalan saat VM restart:

   ```bash
   pm2 save
   pm2 startup
   ```

   Ikuti instruksi yang diberikan oleh perintah `pm2 startup`.

Sekarang, coba buka `http://<IP_PUBLIK_VM_ANDA>` di browser. Anda seharusnya melihat aplikasi Vuetify. Dan jika aplikasi Vuetify Anda memanggil `/api/endpoint`, permintaan itu akan diteruskan ke NestJS. Pengaturan awal selesai!

### Fase 4: Monitoring (Simple, Cepat, Gratis)

Kita tidak akan menginstall stack monitoring yang berat di VM gratis. Kita akan gunakan cara yang efisien.

1. **Monitoring Proses & Log Aplikasi:**

   - SSH ke VM Anda.

   - Lihat status, CPU, dan penggunaan memori dari API NestJS Anda dengan:

     ```bash
     pm2 monit
     ```

   - Lihat log _real-time_ dari API Anda:

     ```bash
     pm2 logs nestjs-api
     ```

1. **Monitoring Uptime Eksternal:**

   - Gunakan layanan gratis seperti **UptimeRobot**.
   - Daftar dan buat dua monitor baru:
     - **Monitor 1 (Web):** Tipe `HTTP(s)`, arahkan ke `http://<IP_PUBLIK_VM_ANDA>`. Ini akan memeriksa apakah web frontend Anda bisa diakses.
     - **Monitor 2 (API):** Buat satu endpoint _health check_ sederhana di NestJS (misal: `GET /api/health` yang mengembalikan status 200). Arahkan monitor ke `http://<IP_PUBLIK_VM_ANDA>:5000/api/health`. Ini akan memeriksa apakah API Anda berjalan.
   - UptimeRobot akan memberi tahu Anda via email jika salah satu layanan Anda _down_.

1. **Monitoring Infrastruktur Bawaan OCI:**

   - Di konsol OCI, navigasi ke **Compute > Instances > (Pilih VM Anda)**.
   - Scroll ke bawah ke bagian **Metrics**. Anda bisa melihat grafik penggunaan CPU, Network I/O, dll., secara gratis.

### Fase 5: Disaster Recovery (Cold Standby)

Bagaimana jika VM Anda di OCI Jakarta tiba-tiba hilang? Kita akan gunakan strategi "Cold Standby" yang sangat cocok untuk Free Tier.

1. **Aset Kritis Anda:**

   - **Kode Aplikasi & Pipeline:** Sudah aman di GitHub.
   - **Definisi Infrastruktur:** Sudah aman dalam file `main.tf` dan `terraform.tfvars`.

1. **Simulasi Bencana:**

   - Anggap VM Anda rusak. Buka terminal di folder proyek Terraform Anda dan hancurkan semua infrastruktur yang ada untuk mensimulasikan kehilangan total:

     ```bash
     terraform destroy --auto-approve
     ```

1. **Proses Pemulihan (Recovery):**

   - **Langkah 1: Ganti Region.** Buka file `provider "oci"` di `main.tf` dan ganti region ke region lain yang tersedia, misalnya `ap-mumbai-1`.

   - **Langkah 2: Bangun Ulang Infrastruktur.** Jalankan kembali Terraform.

     ```bash
     terraform apply --auto-approve
     ```

     Terraform akan membangun VCN dan VM yang identik di Mumbai. Setelah selesai, catat **IP Publik baru** dari VM di Mumbai.

   - **Langkah 3: Update GitHub Secret.** Kembali ke **Settings > Secrets** di repositori GitHub Anda. Update secret `VM_HOST` dengan **IP Publik baru**.

   - **Langkah 4: Picu Deployment.** Pergi ke tab **Actions** di GitHub, pilih workflow "Deploy to OCI VM", dan picu secara manual (_Run workflow_).

   - **Selesai!** Dalam beberapa menit, GitHub Actions akan mengkonfigurasi server baru Anda dan men-deploy versi terakhir dari aplikasi Anda.

Ukur total waktu dari Anda menjalankan `terraform apply` di region baru hingga aplikasi bisa diakses lagi. Itulah **Recovery Time Objective (RTO)** Anda, sebuah metrik kunci untuk laporan UAS Anda.

Dengan mengikuti 5 fase ini, Anda telah membangun sebuah alur kerja DevOps yang lengkap, tangguh, dan sepenuhnya gratis, mencakup semua poin penting yang diminta oleh dosen Anda.
