rm -rf release/dist-development

mkdir release

npm install

cp Dockerfile release/.

cp nginx.conf release/.

ng build --configuration development

cp -r dist/. dist-development

mv dist-development release

file="release/dist-development/.htaccess"
echo "<IfModule mod_rewrite.c>" > $file
echo "  RewriteEngine On" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d" >> $file
echo '  RewriteRule ^ - [L]' >> $file
echo '  ' >> $file
echo '  RewriteRule ^ /index.html [L]' >> $file
echo "</IfModule>" >> $file
cat $file
