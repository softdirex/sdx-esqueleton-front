rm -rf release/dist-production

mkdir release

npm install

cp Dockerfile release/.

cp nginx.conf release/.

ng build --configuration production

cp -r dist/. dist-production

mv dist-production release

tar -czvf sdx-publinex-front.tar.gz release
