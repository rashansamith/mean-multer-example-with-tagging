var app = angular.module('fileUpload', [
    'ngFileUpload',
    'ngResource',
    'ngRoute',
    'ngTagsInput',
    'annotorious',
    'angular-underscore',
    'LocalStorageModule',
    'uuid4'
]);
var tempFileName, tempID;

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider.
    when('/', {
        templateUrl: '../views/home.html'
    }).
    when('/viewAll', {
        templateUrl: '../views/viewAll.html'
    }).
    when('/viewSessions', {
        templateUrl: '../views/viewAllPartner.html'
    }).
    when('/topics', {
        templateUrl: '../views/viewTopics.html'
    }).
    when('/formUpload', {
        templateUrl: '../views/formUpload.html'
    }).
    when('/formImageDes/', {
        templateUrl: '../views/formImageDes.html'
    }).
    when('/formImageDesLocation/', {
        templateUrl: '../views/formImageDes.location.html'
    }).
    when('/formImageInfo/', {
        templateUrl: '../views/formImageInfo.html'
    }).
    when('/formPRelation', {
        templateUrl: '../views/formPRelation.html'
    }).
    when('/formPRelationSub/:uuid/:filename', {
        templateUrl: '../views/formPRelation.Sub.html'
    }).
    when('/uploads/update/:uuid/:filename', {
        templateUrl: '../views/updateForm.html'
    }).
    when('/uploads/:author', {
        templateUrl: '../views/viewAuthor.html'
    }).
    when('/uploads/image/:uuid/:filename', {
        templateUrl: '../views/viewImage.html'
    }).
    otherwise('/');

});



app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);





app.controller('CtrlUpload', ['$http', 'Upload', '$scope', function ($http, Upload, $scope) {

    $http.get('/uploads').then(function (response) {
        console.log(response.data);
        $scope.all = response.data;




    });

    $scope.submit = function () {
        console.log($scope.upload);
        Upload.upload({
            url: '/uploads',
            method: 'post',
            data: $scope.upload
        }).then(function (response) {
            tempID = response.data.file.filename;
            sessionStorage.setItem("ID", tempID);

            tempFileName = response.data.file.originalname;
            sessionStorage.setItem("FileName", tempFileName);

            console.log(tempID);
            console.log(tempFileName);

            console.log(response.data);
            $scope.all.push(response.data);
            $scope.upload = {};
            console.log("Uploaded")
        })
    }
}]);
app.controller('CtrlUpdateData', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    $http.get('/uploads/image/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
        console.log(response.data);
        console.log("________Response.data[0]_______________");
        console.log(response.data[0].sessionName);
        console.log(response.data[0].sessionIdentifier);


        $scope.image = response.data;
        $scope.upload = {
            sessionName: response.data[0].sessionName,
            sessionIdentifier: response.data[0].sessionIdentifier
        };
        console.log("Beginning");
    });
    $scope.submit = function () {
        // console.log($scope.image)
        // console.log("Update")

        Upload.upload({
            url: '/uploads/updateUploadData/' + $routeParams.uuid + '/' + $routeParams.filename,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);



app.controller('CtrlUpdateImageInformation', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {

        console.log(response.data);



        $scope.image = response.data;
        // console.log(response.data[0].tags.imageInformation);
        $scope.tags = ["hallo", "du", "spass"
            // { text: 'Tag1' },
            // { text: 'Tag2' },
            // { text: 'Tag3' }
        ];
        //  $scope.upload = {
        //      tags
        //  }
        //   ];
        // console.log(response.data[0].tags.imageInformation);
        // for (var index = 0; index < uploadimageInformation.artist.length; index++) {
        //     var element = {
        //         text: uploadimageInformation.artist[0]
        //     }
        //     console.log(element);
        // }


        console.log(response.data[0].tags.imageInformation.form);

        $scope.upload = {
            tags: {
                imageInformation: response.data[0].tags.imageInformation
            },
        }
    });

    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/formImageInfo/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);


app.controller('CtrlUpdateImageDescrip', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {

        console.log(response.data);



        $scope.image = response.data;
        console.log(response.data[0].tags.imageInformation);
        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.imageInformation
        //     },
        // }
    });
    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/formImageDes/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);


app.controller('CtrlUpdateImageDescripLoc', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {

        console.log(response.data);



        $scope.image = response.data;
        // console.log(response.data[0].tags.imageInformation);
        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.imageInformation
        //     },
        // }
    });
    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/formImageDesLocation/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);


app.controller('CtrlUpdatePersonalRelation', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {

        console.log(response.data);



        $scope.image = response.data;
        // console.log(response.data[0].tags.imageInformation);
        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.imageInformation
        //     },
        // }
    });
    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/formPRelation/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);

































app.controller('formCtrlSessions', ['$http', 'Upload', '$scope', function ($http, Upload, $scope) {

    $http.get('/uploads/sessions').then(function (response) {
        // console.log(response.data);
        $scope.sessions = response.data;
    });



}]);

app.controller('formCtrlAuthor', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams.author);

    $http.get('/uploads/' + $routeParams.author).then(function (response) {
        console.log(response.data);
        $scope.author = response.data;
    });
}]);


app.controller('CtrlTopic', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams.author);

    $http.get('/uploads/topics').then(function (response) {
        console.log(response.data);
        $scope.topics = response.data;
    });
}]);

app.controller('formCtrlImage', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // // console.log($routeParams);
    // annotorious.plugin.HelloWorldPlugin = function (opt_config_options) {}

    // annotorious.plugin.HelloWorldPlugin.prototype.initPlugin = function (anno) {
    //     // Add initialization code here, if needed (or just skip this method if not)
    // }

    // annotorious.plugin.HelloWorldPlugin.prototype.onInitAnnotator = function (annotator) {
    //     // A Field can be an HTML string or a function(annotation) that returns a string
    //     annotator.popup.addField(function (annotation) {
    //         return '<em>Hello World: ' + annotation.text.length + ' chars</em>'
    //     });
    // }

        annotorious.plugin.prototype._newLoadIndicator = _newLoadIndicator;
        annotorious.plugin.prototype._loadAnnotations = _loadAnnotations;
        annotorious.plugin.prototype._create = _create;
        annotorious.plugin.prototype._update = _update;
        annotorious.plugin.prototype._delete = _delete;

    annotorious.plugin.HelloWorldPlugin = function (opt_config_options) {}

    annotorious.plugin.HelloWorldPlugin.prototype.initPlugin = function (anno) {
        var self = this;
            if (DEBUG) {
                console.log('annotorious-storage:initPlugin');
            }
        // Add initialization code here, if needed (or just skip this method if not)
    }

    annotorious.plugin.HelloWorldPlugin.prototype.onInitAnnotator = function (annotator) {
        // A Field can be an HTML string or a function(annotation) that returns a string
        annotator.popup.addField(function (annotation) {
            return '<em>Hello World: ' + annotation.text.length + ' chars</em>'
        });
    }


    // Add the plugin like so
    anno.addPlugin('HelloWorldPlugin', {});

    $http.get('/uploads/image/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
        console.log(response.data);
        $scope.image = response.data;
    });
}]);



// app.controller('formCtrlSessions', ['$http', 'Upload', '$scope', function($http, Upload, $scope) {

//     $http.get('/uploads/sessions').then(function(response) {
//         console.log(response.data);
//         $scope.sessions = response.data;
//     });
// }]);