<?php

namespace App\Common\Services;

use Illuminate\Http\UploadedFile;

class ImageSaveService
{
    /**
     * Membuat objek service ini bisa dipanggil sebagai fungsi.
     *
     * @param UploadedFile $file File yang akan disimpan.
     * @param string $path Folder tujuan di dalam direktori 'public'.
     * @return string Path relatif dari file yang disimpan.
     */
    public function __invoke(UploadedFile $file, string $path): string
    {
        // Buat nama file yang unik
        $fileName = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();

        // Tentukan path tujuan absolut
        $destinationPath = public_path($path);

        // Pindahkan file
        $file->move($destinationPath, $fileName);

        // Kembalikan path relatif
        return $path . '/' . $fileName;
    }
}
