## sdx-esqueleton-front

This is a esqueleton front for configuration of any new softdirex project front

## Equeleton build with

* [NodeJs v16](https://nodejs.org/en/)
* [npm v8](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Angular 13](https://github.com/angular/angular-cli) 
* [Docker](https://www.docker.com/)

## Esqueleton Releases

### v1.0.0
* Api esqueleton front with login and register component

## New Project installation from sdx-esqueleton-front template

* To clone use the following command:

```
git clone git@github.com:softdirex/sdx-esqueleton-front.git
```

* Rename the project

```
mv sdx-esqueleton-front sdx-<project_name>-front
```

* Then configure your git to a new repository

```
cd sdx-<project_name>-front

git remote set-url origin <remote_url>
```

* Rename the project name in **README.MD** and **package.json** files

README.MD:

```
# sdx-PROJECT_NAME-front

Complete description here...
**IMPORTANT:** First see INITIAL_CONFIGURATION.MD readme file [Delete this line]
```

package.json:

```
{
  "name": "sdx-<project_name>-front",
  ...
}
```

* Configure the transaction key in **environments/environment{.prod}.ts** file, must be same in all similiar softdirex environmets

```
coreTransactionKey:
```

* Configure the application name in **environments/environment{.prod}.ts** file

```
appName:
```

* Install dependencies

```
npm install
```

* Finally run the project

```
ng serve

#Optional you can configure the port with
ng serve --port <PORT_HERE>
```

## Authors

* **Jorge Leiva** (jleiva@softdirex.com)- *Initial work* - [Softdirex](https://www.softdirex.com/).