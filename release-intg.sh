rm -rf release/dist-integration

mkdir release

npm install

cp Dockerfile release/.

cp nginx.conf release/.

ng build --configuration integration

cp -r dist/. dist-integration

mv dist-integration release

tar -czvf sdx-publinex-front.tar.gz release
