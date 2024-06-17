rm -rf release/dist-CLIENT_NAME-ENVIRONMENT

mkdir release

npm install

cp Dockerfile release/.

cp nginx.conf release/.

ng build --configuration ENVIRONMENT

cp -r dist/. dist-CLIENT_NAME-ENVIRONMENT

mv dist-CLIENT_NAME-ENVIRONMENT release

file="release/dist-CLIENT_NAME-ENVIRONMENT/.htaccess"
echo "<IfModule mod_rewrite.c>" > $file
echo "  RewriteEngine On" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]" >> $file
echo "  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d" >> $file
echo '  RewriteRule ^ - [L]' >> $file
echo '  ' >> $file
echo '  RewriteRule ^ /index.html [L]' >> $file
echo "</IfModule>" >> $file
cat $file
