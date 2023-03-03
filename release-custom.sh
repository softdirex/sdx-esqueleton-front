rm -rf release/dist-<client-name>-<environment>

mkdir release

npm install

cp Dockerfile release/.

cp nginx.conf release/.

ng build --configuration <environment>

cp -r dist/. dist-<client-name>-<environment>

mv dist-<client-name>-<environment> release

tar -czvf sdx-publinex-front.tar.gz release
