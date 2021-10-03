const clientId = '';
// const redirectUri = 'https://spottypotty.surge.sh';
const redirectUri = 'http://localhost:3000';
let accessToken;

const Spotify = {

    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // this clears the parameters allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
        else {
            const accessUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public user-read-private user-read-email user-top-read&redirect_uri=${redirectUri}`;
            window.location = accessUri;
        }
    },


    login() {
        const accessToken = Spotify.getAccessToken();
        let userId;
        return fetch(`https://api.spotify.com/v1/me`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.display_name) {
                    return [];
                }
                console.log(jsonResponse);
                console.log(jsonResponse.display_name);
                return jsonResponse.display_name;
            })
    },


    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/artists/${term}/top-tracks?country=US`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                // console.log(jsonResponse);
                return jsonResponse.tracks.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
            })
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })

                }).then(response => response.json()
                ).then(jsonResponse => {
                    console.log(jsonResponse);
                    const playlistId = jsonResponse.id;
                    const playlistLink = jsonResponse.external_urls.spotify;
                    console.log(playlistLink);
                    // Get the modal
                    var modal = document.getElementById("myModal");

                    // Get the button that opens the modal
                    var btn = document.getElementById("myBtn");

                    // append playlist link button to modal
                    function addPlaylistButton(link) {
                       
                        document.getElementById("spottyPottySaved").innerHTML +=
                            "<div class='btnshare'><a class='playlistbtn' target='_blank' href='" + link + "'>Check out your Playlist on Spotify</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u=" + link + "'>Share Playlist on Facebook</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://twitter.com/intent/tweet?text=My%20SpottyPotty%20Playlist&hashtags=NowPlaying,SpottyPotty,Spotify&url=" + link + "'>Share Playlist on Twitter</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/donate/2812440489084919/'>Donate to Charity!</a></div>";
                    }
                    // NEED TO REMOVE OLD LINK FIRST!!!!!!!!!!

                    addPlaylistButton(playlistLink);

                    // Get the <span> element that closes the modal
                    var span = document.getElementsByClassName("close")[0];

                    // When the user clicks on the button, open the modal
                    function myfunction() {
                        modal.style.display = "block";
                    }
                    myfunction();

                    function removeElementsByClass(className) {
                        var elements = document.getElementsByClassName(className);
                        while (elements.length > 0) {
                            elements[0].parentNode.removeChild(elements[0]);
                        }
                    }

                    // When the user clicks on <span> (x), close the modal
                    span.onclick = function () {
                        removeElementsByClass("btnshare");
                        modal.style.display = "none";
                    }

                    // When the user clicks anywhere outside of the modal, close it
                    window.onclick = function (event) {
                       
                        if (event.target == modal) {
                            removeElementsByClass("btnshare");
                            modal.style.display = "none";
                        }
                    }

                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                        {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackUris })
                        })
                })
        });
    },

    topArtists() {
        // Get the modal
        var modal = document.getElementById("myModalloading");
        var modalerror = document.getElementById("myModalerror");

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        // append playlist link button to modal
        // function loadingPlaylist() {
        //     document.getElementById("spottyPottyLoading").innerHTML +=
        //         "<div class='btnshare'><a class='playlistbtn' target='_blank' href=''>Check out your Playlist on Spotify</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u='>Share Playlist on Facebook</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://twitter.com/intent/tweet?text=My%20SpottyPotty%20Playlist&hashtags=NowPlaying,SpottyPotty,Spotify&url='>Share Playlist on Twitter</a></div>";
        // }
        // NEED TO REMOVE OLD LINK FIRST!!!!!!!!!!

        // loadingPlaylist();

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        function myfunction() {
            modal.style.display = "block";
        }
        myfunction();

        function myfunctionerror() {
            modalerror.style.display = "block";
        }
        

        // When the user clicks on the button, open the modal
        function closeModal() {
            modal.style.display = "none";
        }
        

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

       

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
       
        const accessToken = Spotify.getAccessToken();
        let userId;
        return fetch(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.items) {
                    return [];
                }
                console.log(jsonResponse);
                return jsonResponse.items.map(items => ({
                    id: items.id,
                    name: items.name

                    // artist: track.artists[0].name,
                    // album: track.album.name,
                    // uri: track.uri
                }))
            }).then
            (items => {
                // console.log(items);
                var scope = [];
                for (var i = 0; i < items.length; i++) {
                    scope[i] = items[i]['id'];   // create scope.counter1, scope.counter2,...)
                }
                console.log(scope);
                console.log(scope.length);
               
                var fetches = [];
                for (let i = 0; i < scope.length; i++) {
                    console.log(scope[i]);
                    fetches.push(
                        fetch(`https://api.spotify.com/v1/artists/${scope[i]}/top-tracks?country=US`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }).then(value => value.json())
                            
                    );
                }
               return Promise.all(fetches)
           


              
                .then(value => {
                    console.log(value);
                    if (!value[0].tracks) {
                        return [];
                    }
                    console.log(value.length);
                    var final = [];
                     for (let i = 0; i < value.length; i++) {
                      final.push(value[i].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        })
                    ))
                }

                    if (final.length < 10) 
                    {
                        var modalerror = document.getElementById("myModalerror");
                        var span = document.getElementsByClassName("close")[2];
                        console.log(span);
                        function myfunctionerror() {
                            modalerror.style.display = "block";
                        }
                        myfunctionerror();
                        function closeModalerror() {
                            modalerror.style.display = "none";
                        }
                        span.onclick = function () {
                            modalerror.style.display = "none";
                        }
                        
                        window.onclick = function (event) {
                            if (event.target == modalerror) {
                                modalerror.style.display = "none";
                            }
                        }
                        closeModal();
                        final.length = 0;
                        return final;
                    }
                    
                   else {
                        console.log(final);
                        closeModal();
                        return final.flat();
                   }

                   
                    

                    
                        
                        //How to Grab first two tracks for next playlist
                        // var a = value[0].tracks.slice(0, 2).map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                       
                        


                    })

            })

    },




    topArtistsOld() {

        // Get the modal
        var modal = document.getElementById("myModalloading");

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        // append playlist link button to modal
        // function loadingPlaylist() {
        //     document.getElementById("spottyPottyLoading").innerHTML +=
        //         "<div class='btnshare'><a class='playlistbtn' target='_blank' href=''>Check out your Playlist on Spotify</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u='>Share Playlist on Facebook</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://twitter.com/intent/tweet?text=My%20SpottyPotty%20Playlist&hashtags=NowPlaying,SpottyPotty,Spotify&url='>Share Playlist on Twitter</a></div>";
        // }
        // NEED TO REMOVE OLD LINK FIRST!!!!!!!!!!

        // loadingPlaylist();

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        function myfunction() {
            modal.style.display = "block";
        }
        myfunction();

        // When the user clicks on the button, open the modal
        function closeModal() {
            modal.style.display = "none";
        }


        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        const accessToken = Spotify.getAccessToken();
        let userId;
        return fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.items) {
                    return [];
                }
                console.log(jsonResponse);
                return jsonResponse.items.map(items => ({
                    id: items.id,
                    name: items.name

                    // artist: track.artists[0].name,
                    // album: track.album.name,
                    // uri: track.uri
                }))
            }).then
            (items => {
                // console.log(items);
                var scope = [];
                for (var i = 0; i < items.length; i++) {
                    scope[i] = items[i]['id'];   // create scope.counter1, scope.counter2,...)
                }
                console.log(scope);
                console.log(scope.length);

                var fetches = [];
                for (let i = 0; i < scope.length; i++) {
                    console.log(scope[i]);
                    fetches.push(
                        fetch(`https://api.spotify.com/v1/artists/${scope[i]}/top-tracks?country=US`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }).then(value => value.json())

                    );
                }
                return Promise.all(fetches)




                    .then(value => {
                        console.log(value);
                        if (!value[0].tracks) {
                            return [];
                        }
                        console.log(value.length);
                        var final = [];
                        for (let i = 0; i < value.length; i++) {
                            final.push(value[i].tracks.slice(0, 2).map(tracks => ({
                                id: tracks.id,
                                name: tracks.name,
                                artist: tracks.artists[0].name,
                                album: tracks.album.name,
                                uri: tracks.uri
                            })
                            ))
                        }

                        if (final.length < 50)
                        {

                            var modalerror = document.getElementById("myModalerror");
                            var span = document.getElementsByClassName("close")[2];
                            console.log(span);
                            function myfunctionerror() {
                                modalerror.style.display = "block";
                            }
                            myfunctionerror();
                            function closeModalerror() {
                                modalerror.style.display = "none";
                            }
                            span.onclick = function () {
                                modalerror.style.display = "none";
                            }

                            window.onclick = function (event) {
                                if (event.target == modalerror) {
                                    modalerror.style.display = "none";
                                }
                            }

                            closeModal();
                            final.length = 0;
                            return final;
                        }
                        

                        else {

                        
                        console.log(final);
                        closeModal();
                        return final.flat();
                        }



                        //How to Grab first two tracks for next playlist
                        // var a = value[0].tracks.slice(0, 2).map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))




                    })

            })

    },




    topChristmas() {
        // Get the modal
        var modal = document.getElementById("myModalloading");

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        var timeleft = 55;
        var downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                clearInterval(downloadTimer);
            }
            document.getElementById("progressBar").value = 55 - timeleft;
            timeleft -= 1;
        }, 1000);

        // append playlist link button to modal
        // function loadingPlaylist() {
        //     document.getElementById("spottyPottyLoading").innerHTML +=
        //         "<div class='btnshare'><a class='playlistbtn' target='_blank' href=''>Check out your Playlist on Spotify</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u='>Share Playlist on Facebook</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://twitter.com/intent/tweet?text=My%20SpottyPotty%20Playlist&hashtags=NowPlaying,SpottyPotty,Spotify&url='>Share Playlist on Twitter</a></div>";
        // }
        // NEED TO REMOVE OLD LINK FIRST!!!!!!!!!!

        // loadingPlaylist();

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        function myfunction() {
            modal.style.display = "block";
        }
        myfunction();

        // When the user clicks on the button, open the modal
        function closeModal() {
            modal.style.display = "none";
        }
        

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        const accessToken = Spotify.getAccessToken();
        let userId;
        var mytopartists= [];

        mytopartists.push(
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=short_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response=> response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=short_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=medium_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=medium_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=long_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=long_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json())
        );
        console.log(mytopartists);
        return Promise.all(mytopartists)
        // return fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`
        //         }
        //     })
        // .then(response => {
        //         return response.json();
        //     })
        .then(response => {
            if (!response[0].items) {
                return [];
            }
            var items= [];
            for(var k = 0; k < response.length; k++)
            {
                console.log(response[k]);
                items.push(response[k].items.map(items => ({
                    id: items.id,
                    name: items.name

                    // artist: track.artists[0].name,
                    // album: track.album.name,
                    // uri: track.uri
                })))

            }
            
            console.log(items);
            return items.flat();
               
            }).then
            (items => {
                // console.log(items);
                var scope = [];
                for (var i = 0; i < items.length; i++) {
                    scope[i] = items[i]['name'];   // create scope.counter1, scope.counter2,...)
                }
                console.log(scope);
                console.log(scope.length);
                let uniquescope = [];
                scope.forEach((c) => {
                    if (!uniquescope.includes(c)) {
                        uniquescope.push(c);
                    }
                });
                console.log(uniquescope);
                var fetches = [];

                function fetchRetry(url, options = {}, retries = 100, backoff = 9000) {
                    /* 1 */
                    const retryCodes = [408, 429, 492, 500, 502, 503, 504, 522, 524]
                    return fetch(url, options)
                        .then(res => {
                            if (res.ok) return res.json()

                            if (retries > 0 && retryCodes.includes(res.status)) {
                                setTimeout(() => {
                                    /* 2 */
                                    return fetchRetry(url, options, retries - 1, backoff * 1.2) /* 3 */
                                }, backoff) /* 2 */
                            } else {
                                throw new Error(res)
                            }
                        })
                        .catch(console.error)
                }

                var myfetches = [];

                function go(uniquescope) {
                    // console.log(uniquescope);
                    
                   for (let i = 0; i < 50; i++) {
                       if (uniquescope[i] != null) {
                           console.log(uniquescope[i]);
                           fetches.push(
                               fetchRetry(`https://api.spotify.com/v1/search?query=track%3Achristmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                   headers: {
                                       Authorization: `Bearer ${accessToken}`
                                   }
                               }, 1, 9000),
                           );
                       }
                       else {
                           console.log(i);
                       }

                    }
                   
                        // fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asanta+NOT+Barbara+NOT+Monica+NOT+Cruz+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                        //     headers: {
                        //         Authorization: `Bearer ${accessToken}`
                        //     }
                        // }, 100, 9000),
                        // fetchRetry(`https://api.spotify.com/v1/search?query=track%3Axmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                        //     headers: {
                        //         Authorization: `Bearer ${accessToken}`
                        //     }
                        // }, 100, 9000),
                        // fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asnowman+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                        //     headers: {
                        //         Authorization: `Bearer ${accessToken}`
                        //     }
                        // }, 100, 9000)

                        // fetch(`https://api.spotify.com/v1/search?query=track%3Achristmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                        //     {
                        //         headers: {
                        //             Authorization: `Bearer ${accessToken}`
                        //         }
                        //     }).then(value => value.json()),

                        // fetch(`https://api.spotify.com/v1/search?query=track%3Asanta+NOT+Barbara+NOT+Monica+NOT+Cruz+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                        //     {
                        //         headers: {
                        //             Authorization: `Bearer ${accessToken}`
                        //         }
                        //     }).then(value => value.json()),

                        // fetch(`https://api.spotify.com/v1/search?query=track%3Axmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                        //     {
                        //         headers: {
                        //             Authorization: `Bearer ${accessToken}`
                        //         }
                        //     }).then(value => value.json()),
                        // fetch(`https://api.spotify.com/v1/search?query=track%3Asnowman+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                        //     {
                        //         headers: {
                        //             Authorization: `Bearer ${accessToken}`
                        //         }
                        //     }).then(value => value.json())


                   

                   

                    // for (let i = 0; i < uniquescope.length; i++) {
                    //     // console.log(uniquescope[i]);
                    //     fetches.push(
                    //         fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asanta+NOT+Barbara+NOT+Monica+NOT+Cruz+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                    //             headers: {
                    //                 Authorization: `Bearer ${accessToken}`
                    //             }
                    //         }, 100, 9000),
                    //     );
                    // }

                   

                    // for (let i = 0; i < uniquescope.length; i++) {
                    //     // console.log(uniquescope[i]);
                    //     fetches.push(
                    //         fetchRetry(`https://api.spotify.com/v1/search?query=track%3Axmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                    //             headers: {
                    //                 Authorization: `Bearer ${accessToken}`
                    //             }
                    //         }, 100, 9000),
                    //     );
                    // }

                  

                    // for (let i = 0; i < uniquescope.length; i++) {
                    //     // console.log(uniquescope[i]);
                    //     fetches.push(
                    //         fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asnowman+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                    //             headers: {
                    //                 Authorization: `Bearer ${accessToken}`
                    //             }
                    //         }, 100, 9000),
                    //     );
                    // }
                    
                    // if (i < uniquescope.length) {
                    //     i++;
                    //     console.log(i);
                    //     setTimeout(function () {
                    //         go(uniquescope, i);
                    //     }, 300);
                            
                    // }
                    // else {
                    //     myfetches = Promise.all(fetches);
                    //     return myfetches;
                    // }
                    // return myfetches;
                }
                // var i = 0;
                //  if (i < uniquescope.length) {
                //         i++;
                //         console.log(i);
                //         setTimeout(function () {
                //             go(uniquescope, i);
                //         }, 300);
                //     }
                
                // // go(uniquescope, 0);
                // else {
                // return Promise.all(fetches)
                // }
                go(uniquescope);
                var myfetches = Promise.all(fetches);
                console.log(myfetches);
                return myfetches
                // for (let i = 0; i < uniquescope.length; i++) {
                //     console.log(uniquescope[i]);
                //     fetches.push(
                       

                //         fetch(`https://api.spotify.com/v1/search?query=track%3Achristmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                //             {
                //                 headers: {
                //                     Authorization: `Bearer ${accessToken}`
                //                 }
                //             }).then(value => value.json()),

                //         fetch(`https://api.spotify.com/v1/search?query=track%3Asanta+NOT+Barbara+NOT+Monica+NOT+Cruz+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                //             {
                //                 headers: {
                //                     Authorization: `Bearer ${accessToken}`
                //                 }
                //             }).then(value => value.json()),
                        
                //         fetch(`https://api.spotify.com/v1/search?query=track%3Axmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                //             {
                //                 headers: {
                //                     Authorization: `Bearer ${accessToken}`
                //                 }
                //             }).then(value => value.json()),
                //         fetch(`https://api.spotify.com/v1/search?query=track%3Asnowman+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`,
                //             {
                //                 headers: {
                //                     Authorization: `Bearer ${accessToken}`
                //                 }
                //             }).then(value => value.json())


                //     );
                // }
                // return Promise.all(fetches)
                .then(results => {
                    var delay = 5000;
                    return new Promise(resolve => setTimeout(resolve, delay, results));
                })
                .then(results =>{
                    console.log(results);
                    var fetches = [];
                       for (let i = 0; i < 50; i++) {
                           if (uniquescope[i] != null) {
                               // console.log(uniquescope[i]);
                               results.push(
                                   fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asanta+NOT+Barbara+NOT+Monica+NOT+Cruz+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                       headers: {
                                           Authorization: `Bearer ${accessToken}`
                                       }
                                   }, 1, 9000),
                               );
                           }
                           else {
                               console.log(i);
                           }
                   
                }
                var myfetches = Promise.all(results);
                console.log(myfetches);
                return myfetches
            })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Axmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }
                            
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asnowman+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );

                            }
                            else {
                                console.log(i);
                            }
                            
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    //NEXT 50!!!!!!!!!!!!!!!!!!

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Achristmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }
                           
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asanta+NOT+Barbara+NOT+Monica+NOT+Cruz+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }
                           
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Axmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }
                           
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asnowman+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }
                            
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })




                    //NEXT 50!!!!!!!!!!!!!!!!!!

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {

                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Achristmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );

                            }

                            else {
                                console.log(i);
                            }
                            
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asanta+NOT+Barbara+NOT+Monica+NOT+Cruz+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );

                            }

                            else {
                                console.log(i);
                            }
                           
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            // console.log(uniquescope[i]);
                            if (uniquescope[i] != null) {
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Axmas+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }
                            
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            // console.log(uniquescope[i]);
                            if(uniquescope[i] != null)
                            {
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Asnowman+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }
                            
                            
                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })


            



                    .then(value => {
                        console.log(value);
                        if (!value[0].tracks) {
                            return [];
                        }
                        console.log(value.length);
                        value = value.filter(function (element) {
                            return element !== undefined;
                        });
                        console.log(value.length);
                        var final = [];
                        for (let i = 0; i < value.length; i++) {
                            // console.log(value[i].tracks.items);
                            if (value[i] == 'undefined')
                            {
                                console.log(value[i]);
                            }
                            final.push(value[i].tracks.items.slice(0, 1).map(tracks => ({
                                id: tracks.id,
                                name: tracks.name,
                                artist: tracks.artists[0].name,
                                album: tracks.album.name,
                                uri: tracks.uri
                            })
                            ))
                        }

                        var theflattening = final.flat();

                        var finalflat = [];

                        for (let j = 0; j < theflattening.length; j++)
                        {
                            
                            if (scope.indexOf(theflattening[j].artist) != -1)
                            {
                                
                               finalflat.push(theflattening[j]);
                            }
                           
                        }
                        

                        finalflat = finalflat.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i);


                        console.log(finalflat);
                        

                            if (finalflat.length < 5)
                            {

                                var modalerror = document.getElementById("myModalerror");
                                var span = document.getElementsByClassName("close")[2];
                                console.log(span);
                                function myfunctionerror() {
                                    modalerror.style.display = "block";
                                }
                                myfunctionerror();
                                function closeModalerror() {
                                    modalerror.style.display = "none";
                                }
                                span.onclick = function () {
                                    modalerror.style.display = "none";
                                }

                                window.onclick = function (event) {
                                    if (event.target == modalerror) {
                                        modalerror.style.display = "none";
                                    }
                                }

                                closeModal();
                                finalflat.length = 0;
                                return final;
                            }
                        
                       
                        else if (finalflat.length > 100)
                        {
                                closeModal();
                            return finalflat.slice(0,100);
                        }
                        else {
                                closeModal();
                            return finalflat;
                        }
                        
                        // return theflattening;



                        //How to Grab first two tracks for next playlist
                        // var a = value[0].tracks.slice(0, 2).map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))




                    })

            })

    },


    topHalloween() {
        // Get the modal
        var modal = document.getElementById("myModalloading");

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        var timeleft = 55;
        var downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                clearInterval(downloadTimer);
            }
            document.getElementById("progressBar").value = 55 - timeleft;
            timeleft -= 1;
        }, 1000);

        // append playlist link button to modal
        // function loadingPlaylist() {
        //     document.getElementById("spottyPottyLoading").innerHTML +=
        //         "<div class='btnshare'><a class='playlistbtn' target='_blank' href=''>Check out your Playlist on Spotify</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u='>Share Playlist on Facebook</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://twitter.com/intent/tweet?text=My%20SpottyPotty%20Playlist&hashtags=NowPlaying,SpottyPotty,Spotify&url='>Share Playlist on Twitter</a></div>";
        // }
        // NEED TO REMOVE OLD LINK FIRST!!!!!!!!!!

        // loadingPlaylist();

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        function myfunction() {
            modal.style.display = "block";
        }
        myfunction();

        // When the user clicks on the button, open the modal
        function closeModal() {
            modal.style.display = "none";
        }


        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        const accessToken = Spotify.getAccessToken();
        let userId;
        var mytopartists = [];

        mytopartists.push(
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=short_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=short_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=medium_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=medium_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=long_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=long_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json())
        );
        console.log(mytopartists);
        return Promise.all(mytopartists)
            // return fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${accessToken}`
            //         }
            //     })
            // .then(response => {
            //         return response.json();
            //     })
            .then(response => {
                if (!response[0].items) {
                    return [];
                }
                var items = [];
                for (var k = 0; k < response.length; k++) {
                    console.log(response[k]);
                    items.push(response[k].items.map(items => ({
                        id: items.id,
                        name: items.name

                        // artist: track.artists[0].name,
                        // album: track.album.name,
                        // uri: track.uri
                    })))

                }

                console.log(items);
                return items.flat();

            }).then
            (items => {
                // console.log(items);
                var scope = [];
                for (var i = 0; i < items.length; i++) {
                    scope[i] = items[i]['name'];   // create scope.counter1, scope.counter2,...)
                }
                console.log(scope);
                console.log(scope.length);
                let uniquescope = [];
                scope.forEach((c) => {
                    if (!uniquescope.includes(c)) {
                        uniquescope.push(c);
                    }
                });
                console.log(uniquescope);
                var fetches = [];

                function fetchRetry(url, options = {}, retries = 100, backoff = 9000) {
                    /* 1 */
                    const retryCodes = [408, 429, 492, 500, 502, 503, 504, 522, 524]
                    return fetch(url, options)
                        .then(res => {
                            if (res.ok) return res.json()

                            if (retries > 0 && retryCodes.includes(res.status)) {
                                setTimeout(() => {
                                    /* 2 */
                                    return fetchRetry(url, options, retries - 1, backoff * 1.2) /* 3 */
                                }, backoff) /* 2 */
                            } else {
                                throw new Error(res)
                            }
                        })
                        .catch(console.error)
                }

                var myfetches = [];

                function go(uniquescope) {
                    // console.log(uniquescope);

                    for (let i = 0; i < 50; i++) {
                        if (uniquescope[i] != null) {
                            console.log(uniquescope[i]);
                            fetches.push(
                                fetchRetry(`https://api.spotify.com/v1/search?query=track%3Ahalloween+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`
                                    }
                                }, 1, 9000),
                            );
                        }
                        else {
                            console.log(i);
                        }

                    }

                   



                    
                }
              
                go(uniquescope);
                var myfetches = Promise.all(fetches);
                console.log(myfetches);
                return myfetches
                  
                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Anightmare+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Acandy+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aghost+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Amonster+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Avampire+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aafraid+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Adeath+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Ablood+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aevil+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Azombie+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Awitch+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 0; i < 50; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Adarkness+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    //NEXT 50!!!!!!!!!!!!!!!!!!

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Ahalloween+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Anightmare+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Acandy+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aghost+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Amonster+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Avampire+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aafraid+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Adeath+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Ablood+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aevil+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Azombie+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Awitch+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 49; i < 99; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Adarkness+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    

                    

                    

                    

                    
                 



                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    //NEXT 50!!!!!!!!!!!!!!!!!!

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })
                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {

                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Ahalloween+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );

                            }

                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })





                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Anightmare+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Acandy+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aghost+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })


                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Amonster+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Avampire+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aafraid+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Adeath+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Ablood+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Aevil+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Azombie+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Awitch+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })

                    .then(results => {
                        var delay = 5000;
                        return new Promise(resolve => setTimeout(resolve, delay, results));
                    })

                    .then(results => {
                        console.log(results);
                        var fetches = [];
                        for (let i = 99; i < 149; i++) {
                            if (uniquescope[i] != null) {
                                // console.log(uniquescope[i]);
                                results.push(
                                    fetchRetry(`https://api.spotify.com/v1/search?query=track%3Adarkness+artist%3A%22${uniquescope[i]}%22&type=track&offset=0&limit=1`, {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`
                                        }
                                    }, 1, 9000),
                                );
                            }
                            else {
                                console.log(i);
                            }

                        }
                        var myfetches = Promise.all(results);
                        console.log(myfetches);
                        return myfetches
                    })




                   





                    .then(value => {
                        console.log(value);
                        if (!value[0].tracks) {
                            return [];
                        }
                        console.log(value.length);
                        value = value.filter(function (element) {
                            return element !== undefined;
                        });
                        console.log(value.length);
                        var final = [];
                        for (let i = 0; i < value.length; i++) {
                            // console.log(value[i].tracks.items);
                            if (value[i] == 'undefined') {
                                console.log(value[i]);
                            }
                            final.push(value[i].tracks.items.slice(0, 1).map(tracks => ({
                                id: tracks.id,
                                name: tracks.name,
                                artist: tracks.artists[0].name,
                                album: tracks.album.name,
                                uri: tracks.uri
                            })
                            ))
                        }

                        function shuffle(array) {
                            var currentIndex = array.length, temporaryValue, randomIndex;

                            // While there remain elements to shuffle...
                            while (0 !== currentIndex) {

                                // Pick a remaining element...
                                randomIndex = Math.floor(Math.random() * currentIndex);
                                currentIndex -= 1;

                                // And swap it with the current element.
                                temporaryValue = array[currentIndex];
                                array[currentIndex] = array[randomIndex];
                                array[randomIndex] = temporaryValue;
                            }

                            return array;
                        }

                        var theflattening = final.flat();

                        var finalflat = [];

                        for (let j = 0; j < theflattening.length; j++) {

                            if (scope.indexOf(theflattening[j].artist) != -1) {

                                finalflat.push(theflattening[j]);
                            }

                        }
                        shuffle(finalflat);

                        finalflat = finalflat.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i);


                        console.log(finalflat);


                        if (finalflat.length < 5) {

                            var modalerror = document.getElementById("myModalerror");
                            var span = document.getElementsByClassName("close")[2];
                            console.log(span);
                            function myfunctionerror() {
                                modalerror.style.display = "block";
                            }
                            myfunctionerror();
                            function closeModalerror() {
                                modalerror.style.display = "none";
                            }
                            span.onclick = function () {
                                modalerror.style.display = "none";
                            }

                            window.onclick = function (event) {
                                if (event.target == modalerror) {
                                    modalerror.style.display = "none";
                                }
                            }

                            closeModal();
                            finalflat.length = 0;
                            return final;
                        }


                        else if (finalflat.length > 100) {
                            closeModal();
                            return finalflat.slice(0, 100);
                        }
                        else {
                            closeModal();
                            return finalflat;
                        }

                        // return theflattening;



                        //How to Grab first two tracks for next playlist
                        // var a = value[0].tracks.slice(0, 2).map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))




                    })

            })

    },


    myRunningPlaylist() {

        // Get the modal
        var modal = document.getElementById("myModalloading");

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        // append playlist link button to modal
        // function loadingPlaylist() {
        //     document.getElementById("spottyPottyLoading").innerHTML +=
        //         "<div class='btnshare'><a class='playlistbtn' target='_blank' href=''>Check out your Playlist on Spotify</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u='>Share Playlist on Facebook</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://twitter.com/intent/tweet?text=My%20SpottyPotty%20Playlist&hashtags=NowPlaying,SpottyPotty,Spotify&url='>Share Playlist on Twitter</a></div>";
        // }
        // NEED TO REMOVE OLD LINK FIRST!!!!!!!!!!

        // loadingPlaylist();

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        function myfunction() {
            modal.style.display = "block";
        }
        myfunction();

        // When the user clicks on the button, open the modal
        function closeModal() {
            modal.style.display = "none";
        }


        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        const accessToken = Spotify.getAccessToken();
        let userId;
        var fetchess = []
        fetchess.push(


            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=short_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=short_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=medium_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=medium_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=long_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()),
            fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=long_term`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json())


        );

                console.log(fetchess);
        return Promise.all(fetchess)
            .then(response => {
                if (!response[0].items) {
                    return [];
                }
                var items = [];
                for (var k = 0; k < response.length; k++) {
                    console.log(response[k]);
                    items.push(response[k].items.map(items => ({
                        id: items.id,
                        name: items.name

                        // artist: track.artists[0].name,
                        // album: track.album.name,
                        // uri: track.uri
                    })))

                }

                console.log(items);
                items = items.flat();
                items = items.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i);
                console.log(items);
                return items.flat();

            }).then
            (items => {
                // console.log(items);
                var scope = [];
                for (var i = 0; i < items.length; i++) {
                    scope[i] = items[i]['id'];   // create scope.counter1, scope.counter2,...)
                }
                console.log(scope);
                console.log(scope.length);

                function shuffle(array) {
                    var currentIndex = array.length, temporaryValue, randomIndex;

                    // While there remain elements to shuffle...
                    while (0 !== currentIndex) {

                        // Pick a remaining element...
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex -= 1;

                        // And swap it with the current element.
                        temporaryValue = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                    }

                    return array;
                }

                // Used like so
               
                // shuffle(scope);
                // console.log(scope);
                // scope.length = 5;
                const tempo = encodeURIComponent('170');
                const danceability = encodeURIComponent('1.0');
                const energy = encodeURIComponent('1.0');
                const tartempo = encodeURIComponent('180');
                const popularity = encodeURIComponent('100');

                var fetches = [];
                
               
                shuffle(scope);
                console.log(scope);

                const artistsr = scope;

                const n = 5 //get the first 5 items

                const artistsrArray = artistsr.slice(0, n)
                artistsrArray.length = 5;

                shuffle(scope);
                console.log(scope);

                const artistsrr = scope;

                const artistsrrArray = artistsrr.slice(0, n)
                artistsrrArray.length = 5;

                shuffle(scope);
                console.log(scope);

                const artistsrrr = scope;

                const artistsrrrArray = artistsrrr.slice(0, n)
                artistsrrrArray.length = 5;

                shuffle(scope);
                console.log(scope);

                const artistsrrrr = scope;

                const artistsrrrrArray = artistsrrrr.slice(0, n)
                artistsrrrrArray.length = 5;

               
                    fetches.push(
                        

                        fetch(`https://api.spotify.com/v1/recommendations/?seed_artists=${artistsrArray}&min_tempo=${tempo}&target_popularity=${popularity}&target_energy=${energy}&target_danceability=${danceability}&limit=100`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }).then(value => value.json()),
                        fetch(`https://api.spotify.com/v1/recommendations/?seed_artists=${artistsrrArray}&min_tempo=${tempo}&target_popularity=${popularity}&target_energy=${energy}&target_danceability=${danceability}&limit=100`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }).then(value => value.json()),
                        fetch(`https://api.spotify.com/v1/recommendations/?seed_artists=${artistsrrrArray}&min_tempo=${tempo}&target_popularity=${popularity}&target_energy=${energy}&target_danceability=${danceability}&limit=100`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }).then(value => value.json()),
                        fetch(`https://api.spotify.com/v1/recommendations/?seed_artists=${artistsrrrrArray}&min_tempo=${tempo}&target_popularity=${popularity}&target_energy=${energy}&target_danceability=${danceability}&limit=100`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }).then(value => value.json())


                    );
               
               
                return Promise.all(fetches)


                    .then(value => {
                        console.log(value);
                        if (!value[0].tracks) {
                            return [];
                        }
                        console.log(value.length);
                        var final = [];
                        for (let i = 0; i < value.length; i++) {
                            final.push(value[i].tracks.map(tracks => ({
                                id: tracks.id,
                                name: tracks.name,
                                artist: tracks.artists[0].name,
                                album: tracks.album.name,
                                uri: tracks.uri
                            })
                            ))
                        }

                        console.log(final);
                        var finalflat = [];
                        finalflat = final.flat();
                        shuffle(finalflat);
                        finalflat = finalflat.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i);
                        console.log(finalflat);
                        if (finalflat.length < 30)
                        {
                            var modalerror = document.getElementById("myModalerror");
                            var span = document.getElementsByClassName("close")[2];
                            console.log(span);
                            function myfunctionerror() {
                                modalerror.style.display = "block";
                            }
                            myfunctionerror();
                            function closeModalerror() {
                                modalerror.style.display = "none";
                            }
                            span.onclick = function () {
                                modalerror.style.display = "none";
                            }

                            window.onclick = function (event) {
                                if (event.target == modalerror) {
                                    modalerror.style.display = "none";
                                }
                            }
                            closeModal();
                            final.length = 0;
                            return final;
                            
                        }

                        else if (finalflat.length > 100) {
                            closeModal();
                            return finalflat.slice(0, 100);
                        }
                        else {
                            closeModal();
                            return finalflat;
                        }

                       
                        




                        



                        //How to Grab first two tracks for next playlist
                        // var a = value[0].tracks.slice(0, 2).map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))




                    })

            })

    },


    // myGogginsRunningPlaylist() {

    //     // Get the modal
    //     var modal = document.getElementById("myModalloading");

    //     // Get the button that opens the modal
    //     var btn = document.getElementById("myBtn");

    //     // append playlist link button to modal
    //     // function loadingPlaylist() {
    //     //     document.getElementById("spottyPottyLoading").innerHTML +=
    //     //         "<div class='btnshare'><a class='playlistbtn' target='_blank' href=''>Check out your Playlist on Spotify</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://www.facebook.com/sharer/sharer.php?u='>Share Playlist on Facebook</a></div><div class='btnshare'><a class='playlistbtn' target='_blank' href='https://twitter.com/intent/tweet?text=My%20SpottyPotty%20Playlist&hashtags=NowPlaying,SpottyPotty,Spotify&url='>Share Playlist on Twitter</a></div>";
    //     // }
    //     // NEED TO REMOVE OLD LINK FIRST!!!!!!!!!!

    //     // loadingPlaylist();

    //     // Get the <span> element that closes the modal
    //     var span = document.getElementsByClassName("close")[0];

    //     // When the user clicks on the button, open the modal
    //     function myfunction() {
    //         modal.style.display = "block";
    //     }
    //     myfunction();

    //     // When the user clicks on the button, open the modal
    //     function closeModal() {
    //         modal.style.display = "none";
    //     }


    //     // When the user clicks on <span> (x), close the modal
    //     span.onclick = function () {
    //         modal.style.display = "none";
    //     }

    //     // When the user clicks anywhere outside of the modal, close it
    //     window.onclick = function (event) {
    //         if (event.target == modal) {
    //             modal.style.display = "none";
    //         }
    //     }

    //     const accessToken = Spotify.getAccessToken();
    //     let userId;
    //     var fetchess = []
    //     fetchess.push(


    //         fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=short_term`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }).then(response => response.json()),
    //         fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=short_term`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }).then(response => response.json()),
    //         fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=medium_term`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }).then(response => response.json()),
    //         fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=medium_term`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }).then(response => response.json()),
    //         fetch(`https://api.spotify.com/v1/me/top/artists?limit=49&time_range=long_term`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }).then(response => response.json()),
    //         fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=49&time_range=long_term`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }).then(response => response.json())


    //     );

    //     console.log(fetchess);
    //     return Promise.all(fetchess)
    //         .then(response => {
    //             if (!response[0].items) {
    //                 return [];
    //             }
    //             var items = [];
    //             for (var k = 0; k < response.length; k++) {
    //                 console.log(response[k]);
    //                 items.push(response[k].items.map(items => ({
    //                     id: items.id,
    //                     name: items.name

    //                     // artist: track.artists[0].name,
    //                     // album: track.album.name,
    //                     // uri: track.uri
    //                 })))

    //             }

    //             console.log(items);
    //             items = items.flat();
    //             items = items.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i);
    //             console.log(items);
    //             return items.flat();

    //         }).then
    //         (items => {
    //             // console.log(items);
    //             var scope = [];
    //             for (var i = 0; i < items.length; i++) {
    //                 scope[i] = items[i]['id'];   // create scope.counter1, scope.counter2,...)
    //             }
    //             console.log(scope);
    //             console.log(scope.length);

    //             function shuffle(array) {
    //                 var currentIndex = array.length, temporaryValue, randomIndex;

    //                 // While there remain elements to shuffle...
    //                 while (0 !== currentIndex) {

    //                     // Pick a remaining element...
    //                     randomIndex = Math.floor(Math.random() * currentIndex);
    //                     currentIndex -= 1;

    //                     // And swap it with the current element.
    //                     temporaryValue = array[currentIndex];
    //                     array[currentIndex] = array[randomIndex];
    //                     array[randomIndex] = temporaryValue;
    //                 }

    //                 return array;
    //             }

    //             // Used like so

    //             // shuffle(scope);
    //             // console.log(scope);
    //             // scope.length = 5;
    //             const tempo = encodeURIComponent('170');
    //             const danceability = encodeURIComponent('1.0');
    //             const energy = encodeURIComponent('1.0');
    //             const tartempo = encodeURIComponent('180');
    //             const popularity = encodeURIComponent('100');

    //             var fetches = [];


    //             shuffle(scope);
    //             console.log(scope);

    //             const artistsr = scope;

    //             const n = 5 //get the first 5 items

    //             const artistsrArray = artistsr.slice(0, n)
    //             artistsrArray.length = 5;

    //             shuffle(scope);
    //             console.log(scope);

    //             const artistsrr = scope;

    //             const artistsrrArray = artistsrr.slice(0, n)
    //             artistsrrArray.length = 5;

    //             shuffle(scope);
    //             console.log(scope);

    //             const artistsrrr = scope;

    //             const artistsrrrArray = artistsrrr.slice(0, n)
    //             artistsrrrArray.length = 5;

    //             shuffle(scope);
    //             console.log(scope);

    //             const artistsrrrr = scope;

    //             const artistsrrrrArray = artistsrrrr.slice(0, n)
    //             artistsrrrrArray.length = 5;


    //             fetches.push(

                   
                    
    //                 fetch(`https://api.spotify.com/v1/albums/6GfrOuXqJrJjcldIstEz6A`,
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${accessToken}`
    //                         }
    //                     }).then(value => value.json())


    //             );


    //             return Promise.all(fetches)


    //                 .then(value => {
    //                     console.log(value);
    //                     if (!value[0].tracks) {
    //                         return [];
    //                     }
    //                     console.log(value.length);
    //                     console.log(value[0]);

    //                     var final = [];
    //                     for (let i = 0; i < value.length; i++) {
    //                         final.push(value[i].tracks.items.map(tracks => ({
    //                             id: tracks.id,
    //                             name: tracks.name,
    //                             artist: tracks.artists[0].name,
    //                             album: value[i].name,
    //                             uri: tracks.uri
    //                         })
    //                         ))
    //                     }

    //                     console.log(final);
    //                     var finalflat = [];
    //                     finalflat = final.flat();
    //                     // shuffle(finalflat);
    //                     finalflat = finalflat.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i);
    //                     console.log(finalflat);
    //                     if (finalflat.length < 1) {
    //                         var modalerror = document.getElementById("myModalerror");
    //                         var span = document.getElementsByClassName("close")[2];
    //                         console.log(span);
    //                         function myfunctionerror() {
    //                             modalerror.style.display = "block";
    //                         }
    //                         myfunctionerror();
    //                         function closeModalerror() {
    //                             modalerror.style.display = "none";
    //                         }
    //                         span.onclick = function () {
    //                             modalerror.style.display = "none";
    //                         }

    //                         window.onclick = function (event) {
    //                             if (event.target == modalerror) {
    //                                 modalerror.style.display = "none";
    //                             }
    //                         }
    //                         closeModal();
    //                         final.length = 0;
    //                         return final;

    //                     }

    //                     else if (finalflat.length > 100) {
    //                         closeModal();
    //                         return finalflat.slice(2, 3);
    //                     }
    //                     else {
    //                         closeModal();
    //                         return finalflat.slice(2, 3);
    //                     }











    //                     //How to Grab first two tracks for next playlist
    //                     // var a = value[0].tracks.slice(0, 2).map(tracks => ({
    //                     //     id: tracks.id,
    //                     //     name: tracks.name,
    //                     //     artist: tracks.artists[0].name,
    //                     //     album: tracks.album.name,
    //                     //     uri: tracks.uri
    //                     // }))




    //                 })

    //         })

    // },



    topTracks(artistid) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/artists/${artistid}/top-tracks`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
            })
    }

}

export default Spotify;