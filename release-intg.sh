rm -rf release/dist-integration

mkdir release

npm install

cp Dockerfile release/.

cp nginx.conf release/.

ng build --configuration integration

cp -r dist/. dist-integration

mv dist-integration release

file="release/dist-integration/.htaccess"
echo "<IfModule mod_rewrite.c>" > $file
echo "  RewriteEngine On" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d" >> $file
echo '  RewriteRule ^ - [L]' >> $file
echo '  ' >> $file
echo '  RewriteRule ^ /index.html [L]' >> $file
echo "</IfModule>" >> $file
cat $file
