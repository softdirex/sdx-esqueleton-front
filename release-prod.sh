rm -rf release/dist-production

mkdir release

npm install

cp Dockerfile release/.

cp nginx.conf release/.

ng build --configuration production

cp -r dist/. dist-production

mv dist-production release

file="release/dist-production/.htaccess"
echo "<IfModule mod_rewrite.c>" > $file
echo "  RewriteEngine On" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d" >> $file
echo '  RewriteRule ^ - [L]' >> $file
echo '  ' >> $file
echo '  RewriteRule ^ /index.html [L]' >> $file
echo "</IfModule>" >> $file
cat $file
