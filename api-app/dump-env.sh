while IFS='=' read -r key value; do
  if [[ ! -z "$key" && "$key" != \#* ]]; then
    vercel env add "$key" production <<< "$value"
  fi
done < .env.production.local
