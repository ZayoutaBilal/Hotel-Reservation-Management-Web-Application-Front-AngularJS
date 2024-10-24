angular.module("MyApp", ["ngRoute","ui.router", "ngCookies", "vcRecaptcha"])
    .controller('MyController',
        function ($scope, $window, $http, $location , $filter , $cookies, $timeout, $interval, $sce, $stateParams, $state,
                  vcRecaptchaService, Constants) {

            const SUCCESS_MSG = "SUCCESS";
            const FAILED_MSG = "LOGIN_INCORRECT";

            $scope.username = "";
            $scope.email = "";
            $scope.password = "";
            $scope.vpassword = "";

            $scope.errMsg = "";
            $scope.isUserConnected = false;

            $scope.typeofuser="";


            $scope.showPassword = false;

              
              $scope.date_debut = '';
              $scope.date_fin = '';
              $scope.minStartDate = new Date().toISOString().split('T')[0];
              $scope.maxStartDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];



////////////////////////////////////////////////////////////////////////

            $scope.downloadFacteur = function(id_reservation)  {
    
            var apiUrl = 'http://127.0.0.1:8000/api/reservation-facteur/'+ id_reservation;

            // Create a temporary anchor element
            var downloadLink = document.createElement('a');
            downloadLink.href = apiUrl;
            downloadLink.download = 'reservation_facteur_' + id_reservation + '.pdf';
            downloadLink.style.display = 'none';

            // Append the anchor element to the document
            document.body.appendChild(downloadLink);

            // Trigger the click event to start the download
            downloadLink.click();

            // Clean up the temporary anchor element
            document.body.removeChild(downloadLink);
            console.log("done");
        }
  
  
///////////////////////////////////////////////////////////////////////

    
        $scope.AvailableRoompd = function(startDate, endDate) {
            const URL = './server/AvailableRoompd.php';
            const DATA = {
                start_date: startDate,
                end_date: endDate
            };
      
            $http.post(URL, DATA)
            .then(function(response)  {
                $scope.reservations = response.data;
                $location.path(Constants.endpoints["18"]);
                
              })
              .catch(function(error) {
                console.error('Error:', error);
              });
          };







///////////////////////////////////******ADMIN********////////////////////////////

        $scope.addrespo_page=function(){
            $location.path(Constants.endpoints["19"]);
            console.log("AddRespo_page");
        };

        $scope.AddRespo=function(){
                if($scope.password==$scope.confirm_password){
                const URL = 'http://127.0.0.1:8000/api/admin/addrespo';
                const DATA = {
                username:$scope.username,
                email:$scope.email,
                password:$scope.password
                };
                $http.post(URL, DATA).then(function(response) {
                    $scope.serverResponse = response.data;
                    console.log($scope.serverResponse);
                    if ($scope.serverResponse == "SUCCESS") {
                        alert("Congratulations on successfully registering as a Receptionist!");
                        $scope.checkallUsers();
                        console.log("SUCCESS");  
                    } else if($scope.serverResponse =="ERROR"){
                        alert("Registration Error: Account Creation Unsuccessful!!!");
                        console.log("ERROR");
                    }else{
                        alert("Username or Email Is Already Existe!");
                        console.log("Existe");
                    }
                })
        }
        };

        
        $scope.checkallUsers = function() {
                
            const URL = './server/allUsers.php';

            $http.post(URL, Constants.httpConfig).then(function (response) {
                $scope.users = response.data;
                $location.path(Constants.endpoints["20"]);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
        };


        $scope.checkallMessages = function() {
                
            const URL = './server/allMessages.php';

            $http.post(URL, Constants.httpConfig).then(function (response) {
                $scope.messages = response.data;
                $location.path(Constants.endpoints["21"]);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
        };

            $scope.showPopup = false;
            $scope.selected = null;



        $scope.openPopup = function(message) {
            $scope.selected = message;
            $scope.showPopup = true;
            };

            $scope.closePopup = function() {
            $scope.showPopup = false;
            };

            $scope.closePopupUpdate = function() {
            $scope.showPopup = false;
            $scope.checkallUsers();
            };
            $scope.openPopupUpdate = function(user) {
            $scope.selected = user;
            $scope.showPopup = true;
        };



        $scope.deleteUser = function(user) {
        var id_user = user[Object.keys(user)[0]];
        var confirmDelete = confirm('Are you sure you want to delete this User?');
        if (confirmDelete) {
        var URL = 'http://127.0.0.1:8000/api/admin/delete_user';
        var DATA = {
            id_user: id_user
        };

        $http.post(URL, DATA)
            .then(function(response) {
            if (response.data === SUCCESS_MSG) {
                // Actualiser la page des users
                $scope.checkallUsers();
                alert("Account deletion successful.");
                console.log("Supprission done ");
            } else {
                console.log('Error deleting User.');
                alert("Account deletion failed!");
            }
            })
            .catch(function(error) {
            console.log(error);
            });
        }
        };

        $scope.updateUser=function(user){
        var confirmUpdate = confirm('Are you sure you want to update this User?');
            if (confirmUpdate) {
            var id_user = user[Object.keys(user)[0]];
            var username = user.username;
            var password = user.password;
            var email = user.email;
            var typeofuser=user.typeofuser;
            
            var URL = 'http://127.0.0.1:8000/api/admin/update_user';
            var DATA = {
                id_user: id_user,
                username: username,
                password: password,
                email: email,
                typeofuser:typeofuser,
            };

            $http.post(URL, DATA)
                .then(function(response) {
                if (response.data === "ERROR") {
                    $scope.checkallUsers();
                    alert("Username or Email Is Already Existe!");
                    console.log('Error while updating this User.');
                    console.log(response.data);
                } else {
                    $scope.closePopupUpdate();
                    // $scope.checkallUsers();
                    alert("Success! this user has been updated,");
                    console.log('Success! this user has been updated,');
                    console.log(response.data);
                }
        })
        }};
        $scope.deleteMessage=function(message){
        var id_message = message[Object.keys(message)[0]];
        var confirmDelete = confirm('Are you sure you want to delete this message?');
        if (confirmDelete) {
        var URL = 'http://127.0.0.1:8000/api/admin/delete_message';
        var DATA = {
            id_message: id_message
        };

        $http.post(URL, DATA)
            .then(function(response) {
            if (response.data === SUCCESS_MSG) {
            
                $scope.checkallMessages();
                alert("message deletion successful.");
                console.log("Supprission done ");
            } else {
                console.log('Error deleting message.');
                alert("message deletion failed!");
            }
            })
            .catch(function(error) {
            console.log(error);
            });
        }
        };

        $scope.deleteallmessages=function(){
        var confirmDeleteall = confirm('Are you sure you want to delete all messages?');
        if (confirmDeleteall) {
            var URL = 'http://127.0.0.1:8000/api/admin/delete_allmessages';
            
            $http.post(URL)
            .then(function(response) {
            if (response.data === SUCCESS_MSG) {
            
                $scope.checkallMessages();
                alert("All Messages Deletion Successful.");
                console.log("Supprission done ");
            } else {
                console.log('Error deleting all messages.');
                alert("Messages Deletion Failed!");
            }
            })
            .catch(function(error) {
            console.log(error);
            });
        }
        };

        $scope.forgotPassword=function(){
        let prom = prompt("Please enter your email for Reset password", "Your Email");

        if (prom == "") {
            prom = prompt("Please enter your email for Reset password", "your e-mail address is necessary");
        } else {
            var URL = 'http://127.0.0.1:8000/api/forgotPassword';
            var DATA = {
            email: prom
            };
            console.log(prom);
            $http.post(URL, DATA)
            .then(function(response) {
                if (response.data === SUCCESS_MSG) {
                alert("Password  sent successfully! Please check your email.");
                console.log("Reset password done ");
                } else if(response.data ==="ERROR"){
                console.log('Reset password failed.');
                alert("An error occurred while resetting the password. Please try again !");
                }else{
                    console.log('INCORRECT PASSWORD');
                alert("Your Email iS INCORRECT  !");
                }
            })
            .catch(function(error) {
                console.log(error);
            });
            
        }
        }






////////////////////////////////CONFIRMATION///////////////////
    

    // $scope.SendConfirmCode = function() {
    //     const URL = './server/SendConfirmCode.php';
    //     const DATA = {
    //         email: $scope.email
    //     };
    //     $http.post(URL, DATA)
    //         .then(function(response) {
    //             $scope.serverResponse = response.data;
    //             console.log($scope.serverResponse);
    //             if ($scope.serverResponse === 'ERROR') {
    //                 console.log('Failed to send confirmation code.');
    //             } else {
    //                 $location.path(Constants.endpoints["16"]);
    //                 var confirmationCode = $scope.serverResponse;
    //                 console.log('Confirmation code sent: ' + confirmationCode);
    //                 // Further actions, such as storing the confirmation code or displaying a success message, can be added here
    //             }
    //         })
    //         .catch(function(error) {
    //             console.log('Error occurred:', error);
    //         });
    // };


    
    
    
    

    // $scope.SendConfirmCode = function() {
    //     $scope.loading = true;
    //     const URL = './server/SendConfirmCode.php';
    //     const DATA = {
    //         email: $scope.email,
    //         username: $scope.username,
    //         password: $scope.password
    //     };
    //     $http.post(URL, DATA)
    //         .then(function(response) {
    //             $scope.serverResponse = response.data;
    //             console.log($scope.serverResponse);
    //             if ($scope.serverResponse === "username_exists") {
    //                 console.log("Username already exists. Please choose a different username.");
    //                 alert("Username already exists. Please choose a different username.");
    //             } else if ($scope.serverResponse === "email_exists") {
    //                 console.log("Email already exists. Please use a different email address.");
    //                 alert("Email already exists. Please use a different email address.");
    //             } else if ($scope.serverResponse === 'ERROR') {
    //                 console.log('Failed to send confirmation code.');
    //             } else {
    //                 var confirmationCode = $scope.serverResponse;
    //                 console.log('Confirmation code sent: ' + confirmationCode);
    //                 $cookies.putObject('confirmationCode', confirmationCode);
    //                 var storedCode = $cookies.getObject('confirmationCode'); 
    //                 console.log(storedCode);
    //                 var userInformation = {
    //                     email: $scope.email,
    //                     username: $scope.username,
    //                     password: $scope.password,
    //                     confirmationCode: confirmationCode
    //                 };
    //                 $cookies.putObject('USER_INFORMATION', userInformation);
    //                 var storedUserInformation = $cookies.getObject('USER_INFORMATION');
    //                 console.log(storedUserInformation);
    //                 $location.path(Constants.endpoints["16"]);
    //             }
    //         })
    //         .catch(function(error) {
    //             console.log('Error occurred:', error);
    //         });
    // };
    
    
    //     $scope.verifyCode = function() {
            
    //         var storedCode = $cookies.getObject('confirmationCode'); // Retrieve the stored confirmation code from cookies
    //         console.log($scope.confirmationCode);
    //         console.log(storedCode);
        
    //         if ($scope.confirmationCode === storedCode) {
    //             console.log('Code verified successfully.');
    //             alert("Your account has been created successfully, login");
    //             return true;
    //         } else {
    //             console.log('Incorrect code. Please try again.');
    //             alert("Incorrect code. Please try again.");
    //             return false;
    //         }
    //     };
    
            

    //     $scope.verifyAndSignUp = function() {
    //         var result = $scope.verifyCode();
    //         console.log(result);
        
    //         if (result) {
    //             var userInformation = $cookies.getObject('USER_INFORMATION');
    //             console.log(userInformation);
        
    //             const URL = './server/signup.php';
    //             const DATA = {
    //                 username: userInformation.username,
    //                 email: userInformation.email,
    //                 password: userInformation.password
    //             };
        
    //             $http.post(URL, DATA).then(function(response) {
    //                 $scope.serverResponse = response.data;
    //                 console.log($scope.serverResponse);
    //                 if ($scope.serverResponse === "SUCCESS") {
    //                     $location.path(Constants.endpoints["2"]);
    //                     console.log("Signup Done");
    //                     $cookies.remove('USER_INFORMATION');
    //                     $cookies.remove('confirmationCode');
    //                 } else {
    //                     $scope.errMsg = Constants.errorMsgs[$scope.serverResponse];
    //                     console.log("errorMsgs");
    //                 }
    //             })
    //             .catch(function(error) {
    //                 console.log('Error occurred:', error);
    //             });
    //         }
    //     };

    $scope.SendConfirmCode = function() {
        $scope.loading = true;
        const URL = './server/SendConfirmCode.php';
        const DATA = {
            email: $scope.email,
            username: $scope.username,
            password: $scope.password
        };
        $http.post(URL, DATA)
            .then(function(response) {
                $scope.serverResponse = response.data;
                console.log($scope.serverResponse);
                if ($scope.serverResponse === "username_exists") {
                    console.log("Username already exists. Please choose a different username.");
                    alert("Username already exists. Please choose a different username.");
                } else if ($scope.serverResponse === "email_exists") {
                    console.log("Email already exists. Please use a different email address.");
                    alert("Email already exists. Please use a different email address.");
                } else if ($scope.serverResponse === 'ERROR') {
                    console.log('Failed to send confirmation code.');
                } else {
                    var confirmationCode = $scope.serverResponse;
                    console.log('Confirmation code sent: ' + confirmationCode);
                    $cookies.putObject('confirmationCode', confirmationCode);
                    var storedCode = $cookies.getObject('confirmationCode'); 
                    console.log(storedCode);
                    var userInformation = {
                        email: $scope.email,
                        username: $scope.username,
                        password: $scope.password,
                        confirmationCode: confirmationCode
                    };
                    $cookies.putObject('USER_INFORMATION', userInformation);
                    var storedUserInformation = $cookies.getObject('USER_INFORMATION');
                    console.log(storedUserInformation);
                    $location.path(Constants.endpoints["16"]);
                }
            })
            .catch(function(error) {
                console.log('Error occurred:', error);
            });
    };
    
    
        $scope.verifyCode = function() {
            
            var storedCode = $cookies.getObject('confirmationCode'); // Retrieve the stored confirmation code from cookies
            console.log($scope.confirmationCode);
            console.log(storedCode);
        
            if ($scope.confirmationCode === storedCode) {
                console.log('Code verified successfully.');
                alert("Your account has been created successfully, login");
                return true;
            } else {
                console.log('Incorrect code. Please try again.');
                alert("Incorrect code. Please try again.");
                return false;
            }
        };
    
            

        $scope.verifyAndSignUp = function() {
            var result = $scope.verifyCode();
            console.log(result);
        
            if (result) {
                var userInformation = $cookies.getObject('USER_INFORMATION');
                console.log(userInformation);
        
                const URL = './server/signup.php';
                const DATA = {
                    username: userInformation.username,
                    email: userInformation.email,
                    password: userInformation.password
                };
        
                $http.post(URL, DATA).then(function(response) {
                    $scope.serverResponse = response.data;
                    console.log($scope.serverResponse);
                    if ($scope.serverResponse === "SUCCESS") {
                        $location.path(Constants.endpoints["2"]);
                        console.log("Signup Done");
                        $cookies.remove('USER_INFORMATION');
                        $cookies.remove('confirmationCode');
                    } else {
                        $scope.errMsg = Constants.errorMsgs[$scope.serverResponse];
                        console.log("errorMsgs");
                    }
                })
                .catch(function(error) {
                    console.log('Error occurred:', error);
                });
            }
        };
        
    
    


        // $scope.activateAccount = function() {

        //     console.log($stateParams.mail);
        //     var CONFIG = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        //     $http.post("verify.php", { mail: $stateParams.mail }, CONFIG).then(function(r){
        //         console.log(r.data);
        //     });
        // }


///////////////////////////////////PROFIL////////////////////////////////////////

        $scope.modifyUsername = function(newUsername) {
            var userInfo = $cookies.getObject('USER_INFO');
            if (userInfo) {
            userInfo.username = newUsername;
            $cookies.putObject('USER_INFO', userInfo);
            $scope.username = newUsername;
            }
        };
        
        $scope.userinfo = function() {
            $scope.username = $cookies.getObject('USER_INFO').username;
            $scope.email = $cookies.getObject('USER_INFO').email;
        };
        
        $scope.deletemyaccount = function() {
            var confirmation = confirm("Are you sure you want to delete your account?");
            if (confirmation) {
            const URL = 'http://127.0.0.1:8000/api/delete_my_account';
            const DATA = {
                id_user: $cookies.getObject('USER_INFO').id_user
            };
        
            $http.post(URL, DATA).then(function(response) {
                $scope.serverResponse = response.data;
                console.log($scope.serverResponse);
        
                if ($scope.serverResponse == "SUCCESS") {
                $cookies.remove('USER_INFO');
                $location.path(Constants.endpoints["2"]);
                
                alert("Account deletion successful.");
                console.log("SUCCESS_delete");
                } else {
                alert("Account deletion failed!");
                console.log("ERROR_delete");
                }
            });
            }
        };
        
        $scope.updatemypassword = function() {
            if ($scope.new_password == $scope.confirm_password) {
            const URL = 'http://127.0.0.1:8000/api/update_profile/password';
            const DATA = {
                id_user: $cookies.getObject('USER_INFO').id_user,
                new_password: $scope.new_password,
                old_password: $scope.old_password
            };
        
            $http.post(URL, DATA).then(function(response) {
                $scope.serverResponse = response.data;
                console.log($scope.serverResponse);
        
                if ($scope.serverResponse == "SUCCESS") {
                // Update the password in the USER_INFO cookie
                var userInfo = $cookies.getObject('USER_INFO');
                if (userInfo) {
                    userInfo.password = $scope.new_password;
                    $cookies.putObject('USER_INFO', userInfo);
                }
        
                $location.path(Constants.endpoints["-------"]);
                alert("Success! Your profile has been updated");
                console.log("SUCCESS_update");
                $location.path(Constants.endpoints["14"]);
        
                } else if ($scope.serverResponse == "ERROR") {
                alert("An error occurred while updating your profile. Please try again later!");
                console.log("ERROR_update");
                } else {
                alert("INCORRECT_PASSWORD, Please try again with the correct password!");
                console.log("ERROR_update");
                }
            });
            }
        };
        
        $scope.showUpdateUsername = false;
        $scope.toggleUpdateUsername = function() {
            $scope.showUpdateUsername = !$scope.showUpdateUsername;
            $scope.new_username = '';
        };
        
        $scope.updatemyusername = function() {
            if ($scope.new_username !== "") {
            const URL = 'http://127.0.0.1:8000/api/update_profile/username';
            const DATA = {
                id_user: $cookies.getObject('USER_INFO').id_user,
                new_username: $scope.new_username,
            };
            $http.post(URL, DATA).then(function(response) {
                $scope.serverResponse = response.data;
                console.log($scope.serverResponse);
        
                if ($scope.serverResponse == "SUCCESS") {
                // Update the username cookie
                $scope.modifyUsername($scope.new_username);
        
                alert("Success! Your profile has been updated");
                console.log("SUCCESS_update");
                $scope.toggleUpdateUsername();
                $window.location.reload();
                } else {
                alert("Username already exists. Please choose a different username.!");
                console.log("ERROR_update");
                }
            });
            }
        };
        console.log("cookies: ");
        console.log($cookies.getObject('USER_INFO'));
        
        



///////////////////////////// Back button///////////////////////////////////////////

            $scope.goBack = function() {
                $window.history.back();
            };

            
            
///////////////////////////////////////////DATES/////////

            $scope.$watchGroup(['date_debut', 'date_fin'], function(newValues, oldValues) {
                var startDate = new Date(newValues[0]);
                var endDate = new Date(newValues[1]);
            
                if (startDate >= endDate) {
                    $scope.endDateError = "The end date must be after the start date.";
                } else if (startDate < new Date() && startDate.toDateString() !== new Date().toDateString()) {
                    $scope.startDateError = "The start date cannot be in the past.";
                    $scope.endDateError = "";
                } else if (endDate < new Date()) {
                    $scope.startDateError = "";
                    $scope.endDateError = "The end date cannot be in the past.";
                } else if (endDate == startDate) {
                    $scope.startDateError = "";
                    $scope.endDateError = "End date cannot be the same as start date.";
                } else {
                    $scope.startDateError = "";
                    $scope.endDateError = "";
                }
            });
            $scope.filterRooms = function(filter) {
                // Remove 'filter-active' class from all filter buttons
                angular.element(document.querySelectorAll('#rooms-flters li')).removeClass('filter-active');
                
                // Add 'filter-active' class to the clicked filter button
                angular.element(event.target).addClass('filter-active');
            
                // Show/hide rooms based on the selected filter
                angular.element(document.querySelectorAll('.rooms-item')).css('display', 'none');
                angular.element(document.querySelectorAll(filter)).css('display', 'block');
              };

///////////////////////////////////////////is Reserver/////////
            $scope.isReserver = function() {
                var id_user = $cookies.getObject('USER_INFO').id_user;
            
                const URL = './server/isReserver.php';
                const DATA = {
                id_user: id_user
                };
            
                $http.post(URL, DATA).then(function(response) {
                    if (response.data === '1' ) {
                      $scope.showReservationButton = false;
                    } else {
                      $scope.showReservationButton = true;
                    }
                  }).catch(function(error) {
                    console.log('Error checking reservation:', error);
                  });
            };
  
            // $scope.isReserver = function() {
            //     var id_user = $cookies.getObject('USER_INFO').id_user; 

            //     const URL = './server/isReserver.php';
            //     const DATA = {
            //         id_user: id_user
            //     };
              
                // $http.post(URL, DATA).then(function(response) {
                //   if (response.data === '1' ) {
                //     $scope.showReservationButton = true;
                //   } else {
                //     $scope.showReservationButton = false;
                //   }
                // }).catch(function(error) {
                //   console.log('Error checking reservation:', error);
                // });
            //   };


///////////////////////////////////////////Reservation//////////////////////////////////////////////////
            $scope.Reservation = function() {
                if($scope.startDateError === "" && $scope.endDateError === "") {
                    const URL ='http://127.0.0.1:8000/api/reservation';
                    const DATA = {
                        username: $cookies.getObject('USER_INFO').username,
                        // username: ,
                        fullname: $scope.fullname,
                        phone: $scope.phone,
                        type_chambre: $scope.type_chambre,
                        
                        date_debut:$filter('date')($scope.date_debut,'yyyy-MM-dd'),
                        
                        date_fin:$filter('date')($scope.date_fin,'yyyy-MM-dd'),
                    };

                    $http.post(URL, DATA).then(function(response) {
                        $scope.serverResponse = response.data;
                        console.log($scope.serverResponse);

                        if ($scope.serverResponse === SUCCESS_MSG) {
                            $cookies.putObject('RES_INFO', {
                                fullname: $scope.fullname
                            });
                            $location.path(Constants.endpoints["8"]);
                            alert("Your reservation has been saved!");
                            console.log("reservation Done");
                        } else {
                            alert("No room of this type is available on this date");
                            $scope.errMsg = Constants.errorMsgs[$scope.serverResponse];
                            console.log("errorMsgs");
                        }
                    })
                }
            };

///////////////////////////////////////////get Reservation//////////////////////////////////////////////////

        $scope.checkReservation = function() {
            
            var id_user = $cookies.getObject('USER_INFO').id_user; // Supposons que vous avez une fonction getCookie pour obtenir la valeur du cookie id_user

            const URL = './server/getReservationInfo.php';
            const DATA = {
                id_user: id_user,
            };

            $http.post(URL, DATA, Constants.httpConfig).then(function (response) {
                for(var i = 0; i < response.data.length; ++i) {
                    response.data[i].date_debut = new Date(response.data[i].date_debut);
                    response.data[i].date_fin = new Date(response.data[i].date_fin);
                }
                $scope.reservations = response.data;
                $location.path(Constants.endpoints["8"]);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
        };

        $scope.checkpassReservation = function() {
            
            var id_user = $cookies.getObject('USER_INFO').id_user; // Supposons que vous avez une fonction getCookie pour obtenir la valeur du cookie id_user

            const URL = './server/passReservation.php';
            const DATA = {
                id_user: id_user,
            };

            $http.post(URL, DATA, Constants.httpConfig).then(function (response) {
                $scope.reservations = response.data;
                $location.path(Constants.endpoints["9"]);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
        };

        $scope.formatDate = function(date) {
            return new Date (date);
        }



/////////////////////////AvailableRooms///////////////////////////////////////


        $scope.AvailableRooms = function() {
                            
            const URL = './server/AvailableRooms.php';

            $http.post(URL, Constants.httpConfig).then(function (response) {
                $scope.reservations = response.data;
                $location.path(Constants.endpoints["17"]);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
        };

// //////////////////////////////////////////checkReservations///////////DELETE////////////

        $scope.checkallReservation = function() {
                    
            const URL = './server/allReservations.php';

            $http.post(URL, Constants.httpConfig).then(function (response) {
                $scope.reservations = response.data;
                $location.path(Constants.endpoints["10"]);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
        };

        $scope.checkoldReservations = function() {
                    
            const URL = './server/oldReservations.php';

            $http.post(URL, Constants.httpConfig).then(function (response) {
                $scope.reservations = response.data;
                $location.path(Constants.endpoints["11"]);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
        };

        $scope.checkRespoReservation = function() {
            var id_user = $cookies.getObject('USER_INFO')?.id_user;
            if (!id_user) {
                console.log('User ID not found.');
                return;
            }
        
            const URL = './server/RespoReservations.php';
            const DATA = {
                id_user: id_user,
            };
        
            $http.post(URL, DATA, Constants.httpConfig)
                .then(function(response) {
                    for (var i = 0; i < response.data.length; ++i) {
                        response.data[i].date_debut = new Date(response.data[i].date_debut);
                        response.data[i].date_fin = new Date(response.data[i].date_fin);
                    }
                    $scope.reservations = response.data;
                    $location.path(Constants.endpoints["12"]);
                    console.log(response.data);
                })
                .catch(function(error) {
                    console.log('Error occurred during the request:', error);
                });
        };
        

        // $scope.checkRespoReservation = function() {
            
        //     var id_user = $cookies.getObject('USER_INFO').id_user; // Supposons que vous avez une fonction getCookie pour obtenir la valeur du cookie id_user

        //     const URL = './server/RespoReservations.php';
        //     const DATA = {
        //         id_user: id_user,
        //     };

        //     $http.post(URL, DATA, Constants.httpConfig).then(function (response) {
        //         for(var i = 0; i < response.data.length; ++i) {
        //             response.data[i].date_debut = new Date(response.data[i].date_debut);
        //             response.data[i].date_fin = new Date(response.data[i].date_fin);
        //         }
        //         $scope.reservations = response.data;
        //         $location.path(Constants.endpoints["12"]);
        //         console.log(response.data);
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //     });
        // };

///////////////////////////////////////////delete / update Reservation//////////////////////////////////////////////////

$scope.updateReservation = function(reservation) {
    var confirmUpdate = confirm('Are you sure you want to update this booking?');
    if (confirmUpdate) {
        var id_reservation = reservation[Object.keys(reservation)[0]];
        var fullname = reservation.fullname;
        var phone = reservation.phone;
        var type_chambre = reservation.type_chambre;
        var date_debut = reservation.date_debut;
        var date_fin = reservation.date_fin;
        if ($scope.validateReservationDates(date_debut, date_fin)) {
            var URL = './server/updateReservation.php';
            var DATA = {
                id_reservation: id_reservation,
                fullname: fullname,
                phone: phone,
                type_chambre: type_chambre,
                date_debut: date_debut,
                date_fin: date_fin
            };

            $http.post(URL, DATA, Constants.httpConfig)
                .then(function(response) {
                    if (response.data.message === "ERROR") {
                        alert("No Modification");
                        console.log('No Modification');
                        console.log(response.data);
                    } else if (response.data.message === "No available") {
                        alert("No available chambre of the same type between the given dates!");
                        console.log('No available chambre of the same type between the given dates');
                        console.log(response.data);
                    } else if (response.data.message === "SUCCESS") {
                        alert("Your reservation has been edited, Check your email, Your booking form has been sent .!");
                        console.log("Your reservation has been edited!");
                        console.log(response.data);
                        $window.location.reload(); // Refresh the page
                    } else {
                        alert("Your reservation has been edited!");
                        console.log("Your reservation has been edited!");
                        console.log(response.data);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        } else {
            alert(" Invalid reservation dates ");
            console.log('Error: Invalid reservation dates.');
        }
    }
};
        

/*////////////////////////////////*/            

              

              $scope.validateReservationDates = function(start, end) {
                var startDate = new Date(start);
                var endDate = new Date(end);
              
                if (startDate >= endDate) {
                  $scope.endDateError = 'The end date must be after the start date.';
                  return false;
                } else if (startDate < new Date() && startDate.toDateString() !== new Date().toDateString()) {
                  $scope.startDateError = 'The start date cannot be in the past.';
                  $scope.endDateError = '';
                  return false;
                } else if (endDate < new Date()) {
                  $scope.startDateError = '';
                  $scope.endDateError = 'The end date cannot be in the past.';
                  return false;
                } else if (endDate.getTime() === startDate.getTime()) {
                  $scope.startDateError = '';
                  $scope.endDateError = 'The end date cannot be the same as the start date.';
                  return false;
                } else {
                  $scope.startDateError = '';
                  $scope.endDateError = '';
                  return true;
                }
              };
            

              /*/////////////////////////// */
              
  

            $scope.deleteReservation = function(reservation) {
                var id_reservation = reservation[Object.keys(reservation)[0]];
                var confirmDelete = confirm('Are you sure you want to delete this booking?');
                if (confirmDelete) {
                  var URL = './server/deleteReservation.php';
                  var DATA = {
                    id_reservation: id_reservation
                  };
            
                  $http.post(URL, DATA, Constants.httpConfig)
                    .then(function(response) {
                      if (response.data === SUCCESS_MSG) {
                        // Actualiser la page des réservations
                        // $scope.checkReservation();
                        $window.location.reload();
                        console.log("Supprission done ");
                      } else {
                        console.log('Error deleting reservation.');
                      }
                    })
                    .catch(function(error) {
                      console.log(error);
                    });
                }
              };
              

///////////////////////////////////////////make Reservation//////////////////////////////////////////////////

              $scope.makeReservation = function() {
                if (!$scope.isUserConnected) {
                  // Si l'utilisateur n'est pas connecté, afficher le lien de connexion
                  console.log("you should be connected");
                  alert("Please login to continue.");
                  $location.path(Constants.endpoints["2"]);
                  return;
                }
                else if ($scope.isUserConnected) {
                    console.log("you are connected");
                    $location.path(Constants.endpoints["7"]);
                    return;
                  }
            }
            
            
            
///////////////////////////////////////////Sign up//////////////////////////////////////////////////

        // $scope.signUpNewUser = function () {
        //     const URL = './server/signup.php';
        //     const DATA = {
        //         username: $scope.username,
        //         email: $scope.email,
        //         password: $scope.password
        //     };
        //     $http.post(URL, DATA).then(function (response) {
        //         $scope.serverResponse = response.data;
        //         console.log($scope.serverResponse);
        //         if ($scope.serverResponse === "SUCCESS") {
        //             $location.path(Constants.endpoints["2"]);
        //             console.log("signup Done");
        //         } else if ($scope.serverResponse === "username_exists") {
        //             console.log("Username already exists. Please choose a different username.");
        //             alert("Username already exists. Please choose a different username.");
        //         } else if ($scope.serverResponse === "email_exists") {
        //             console.log("Email already exists. Please use a different email address.");
        //             alert("Email already exists. Please use a different email address.");
        //         } else {
        //             $scope.errMsg = Constants.errorMsgs[$scope.serverResponse];
        //             console.log("errorMsgs");
        //         }
        //     });
        // };

       
        

///////////////////////////////////////////submit form //////////////////////////////////////////////////


            $scope.submitForm = function(){
                
                $http({
                  method: 'POST',
                  url: 'http://127.0.0.1:8000/api/contact',
                  data: {
                    name:$scope.formData.name,
                    email:$scope.formData.email,
                    subject:$scope.formData.subject,
                    message:$scope.formData.message
                  }
                }).then(function(response) {
                  console.log(response.data);
                  $scope.showSuccessMessage = true;
                  $scope.showErrorsMessage = false;
                
                }, function(error) {
                  console.log(error.data);
                  $scope.showErrorsMessage = true;
                  $scope.showSuccessMessage = false;
                  
                });
              };

///////////////////////////////////////////Sign in//////////////////////////////////////////////////

            $scope.signInUser = function () {
                const URL = "./server/signin.php";
                const data = {
                username: $scope.username,
                password: $scope.password
                };
                $http.post(URL, data, Constants.httpConfig).then(function (response) {
                $scope.serverResponse = response.data;
                if (response.data === FAILED_MSG) {
                    $scope.errMsg = Constants.errorMsgs[$scope.serverResponse];
                    console.log("The username or password is incorrect");
                } else {
                    $cookies.putObject('USER_INFO', response.data[0]);
            
                    if (response.data[0].typeofuser === "NUser") {
                    console.log(response.data[0].typeofuser);
                    $scope.typeofuser = 'NUser'; // Set isNUser to 'true' for NUser
                    $location.path(Constants.endpoints["1"]);
                    console.log("Sign-in done");
                    } else if (response.data[0].typeofuser === "Respo") {
                    console.log(response.data[0].typeofuser);
                    $scope.typeofuser = 'Respo';
                    $location.path(Constants.endpoints["1"]);
                    console.log("Sign-in done");
                    }else if (response.data[0].typeofuser === "Admin") {
                        console.log(response.data[0].typeofuser);
                        $scope.typeofuser = 'Admin';
                        $location.path(Constants.endpoints["1"]);
                        console.log("Sign-in done");
                        }
                }
                });
            }
  
              
            // $scope.signInUser = function () {
            //     const URL = "./server/signin.php";
            //     const data = {
            //         username: $scope.username,
            //         password: $scope.password
            //     };
            //     $http.post(URL, data, Constants.httpConfig).then(function (response) {
            //         $scope.serverResponse = response.data;
            //         if(response.data === FAILED_MSG) {
            //             $scope.errMsg = Constants.errorMsgs[$scope.serverResponse];
            //             console.log("The username or password is incorrect");
            //         } else {
            //             $cookies.putObject('USER_INFO', response.data[0]);
            //             if (response.data[0].typeofuser === "NUser") {
            //             console.log(response.data[0].typeofuser);
            //             $location.path(Constants.endpoints["1"]);
            //             console.log("signin Done");
            //             }
            //             else if(response.data[0].typeofuser === "Respo"){
            //                 console.log(response.data[0].typeofuser);
            //                 $location.path(Constants.endpoints["10"]);
            //                 console.log("signin Done");
            //             }
            //         }
            //     });
            // }

///////////////////////////////////////////checkPassword//////////////////////////////////////////////////

            // $scope.checkPassword = function() {
            //     if ($scope.password !== $scope.user.confirmPassword) {
            //       $scope.confirmPasswordError = true;
            //     } else {
            //       $scope.confirmPasswordError = false;
            //     }
            //   };
              
///////////////////////////////////////////log out//////////////////////////////////////////////////

            $scope.logout = function () {
                if ($scope.isUserConnected) {
                    $cookies.remove('USER_INFO');
                    $location.path(Constants.endpoints["2"]);
                    console.log("logout Done");
                    $scope.typeofuser ="";
                }
            }

/////////////////////////////////////////// is user connected//////////////////////////////////////////////////
                $scope.isConnected = function () {
                console.log($cookies.getObject('USER_INFO'));
                $scope.isUserConnected = !!$cookies.getObject('USER_INFO');
                if (!$scope.isUserConnected && Constants.endpoints["1"] !== $location.path()
                    && Constants.endpoints["2"] !== $location.path()
                    && Constants.endpoints["3"] !== $location.path()
                    && Constants.endpoints["4"] !== $location.path()
                    && Constants.endpoints["5"] !== $location.path()
                    && Constants.endpoints["6"] !== $location.path()
                    && Constants.endpoints["16"] !== $location.path()) {
                    $location.path(Constants.endpoints["1"]);
                    console.log("choix 1");
                }
                

                if ($scope.isUserConnected) {
                    
                    console.log($cookies.getObject('USER_INFO').typeofuser);
                    if ($cookies.getObject('USER_INFO').typeofuser === 'NUser') {
                        console.log("NUser");
                        $scope.typeofuser = 'NUser'; 
                    } else if ($cookies.getObject('USER_INFO').typeofuser === 'Respo') {
                        console.log("Respo");
                        $scope.typeofuser = 'Respo';
                    } else if ($cookies.getObject('USER_INFO').typeofuser === 'Admin') {
                        console.log("Admin");
                        $scope.typeofuser = 'Admin';
                        
                    }

                    if ((Constants.endpoints["2"] === $location.path()
                        || Constants.endpoints["3"] === $location.path())) {
                        $location.path(Constants.endpoints["1"]);
                        $location.reload();
                        console.log("choix 2-1");
                    }
                    
                    $scope.username = $cookies.getObject('USER_INFO').username;
                    console.log("choix 2-2");
                }
            }
        })

    .constant('Constants', {
        errorMsgs: {
            "USER_EXIST": "This username/email already exist !",
            "LOGIN_INCORRECT": "The username or password is incorrect !"
        },
        endpoints: {
            1: '/',
            2: '/sign-in',
            3: '/sign-up',
            4: '/about',
            5: '/rooms',
            6: '/contact',
            7: '/reservation',
            8:'/votrereservation',
            9:'/passReservation',
            10:'/allReservations',
            11:'/oldReservations',
            12:'/RespoReservations',
            14:'/profile',
            15:'/update_password',
            16:'/Confirmcode',
            17:'/AvailableRooms',
            18:'/AvailableRoompd',
            19:'/addrespo',
            20:'/Accounts',
            21:'/messages'
        },
        httpConfig: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    })

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$provide', 'Constants',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $provide, Constants) {

            $stateProvider

                .state('home', {
                    url: Constants.endpoints["1"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/home.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('signIn', {
                    url: Constants.endpoints["2"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/sign-in.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('signUp', {
                    url: Constants.endpoints["3"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/sign-up.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('about', {
                    url: Constants.endpoints["4"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/about.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('rooms', {
                    url: Constants.endpoints["5"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/rooms.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('contact', {
                    url: Constants.endpoints["6"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/contact.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('reservation', {
                    url: Constants.endpoints["7"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/reservation.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('votrereservation', {
                    url: Constants.endpoints["8"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/votrereservation.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('passReservation', {
                    url: Constants.endpoints["9"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/passReservation.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('allReservations', {
                    url: Constants.endpoints["10"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/allReservations.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('oldReservations', {
                    url: Constants.endpoints["11"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/oldReservations.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('RespoReservations', {
                    url: Constants.endpoints["12"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/RespoReservations.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('profile', {
                    url: Constants.endpoints["14"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/profile.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('update_password', {
                    url: Constants.endpoints["15"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/update_password.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('Confirmcode', {
                    url: Constants.endpoints["16"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/Confirmcode.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('AvailableRooms', {
                    url: Constants.endpoints["17"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/AvailableRooms.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('AvailableRoompd', {
                    url: Constants.endpoints["18"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/AvailableRoompd.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('addrespo', {
                    url: Constants.endpoints["19"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/addrespo.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('allUsers', {
                    url: Constants.endpoints["20"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/Accounts.html',
                            controller: "MyController"
                        }
                    }
                })
                .state('allmessages', {
                    url: Constants.endpoints["21"],
                    views: {
                        'header': {
                            templateUrl: './views/header.html',
                            controller: "MyController"
                        },
                        'content': {
                            templateUrl: './views/messages.html',
                            controller: "MyController"
                        }
                    }
                });

            $urlRouterProvider.otherwise(Constants.endpoints["1"]);
            $locationProvider.html5Mode(true);
        }]);

        /**/