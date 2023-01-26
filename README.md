# sdx-PROJECT_NAME-front

Complete description here...
**IMPORTANT:** First see INITIAL_CONFIGURATION.MD readme file [Delete this line]

## Build with

* [NodeJs v16](https://nodejs.org/en/)
* [npm v8](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Angular 13](https://github.com/angular/angular-cli) 
* [Docker](https://www.docker.com/)

## Releases

### v1.0.0
* Releases detail

## Project installation

* To clone this project use the following command:

```
git clone git@github.com:softdirex/sdx-<project_name>-front.git
```

* To install dependencies run:

```
npm install
```

* Finally you can serve the project

```
ng serve
```

### Create github release

```
rm -rf release

mkdir release

npm install

ng build --configuration <environment>

cp Dockerfile release/.

cp nginx.conf release/.

cp -r dist/. dist-<environment>

mv dist-<environment> release

tar -czvf sdx-<projectName>-front.tar.gz release
```

**Important:** Then upload tar.gz file to [release in github](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) and recheckview the new ASSET_ID

### Download release

```
export GIT_TOKEN=<token>

export API_URL="https://$GIT_TOKEN:@api.github.com/repos/softdirex/sdx-<projectName>-front"

export ASSET_ID=$(curl $API_URL/releases/latest | jq -r '.assets[0].id')

curl -O -J -L -H "Accept: application/octet-stream" "$API_URL/releases/assets/$ASSET_ID"

# This unzip a dist folder
tar -xvf sdx-<projectName>-front.tar.gz

cp -r release/dist-<environment>/. dist/
```


## Authors

* **Jorge Leiva** (jleiva@softdirex.com)- *Initial work* - [Softdirex](https://www.softdirex.com/).
