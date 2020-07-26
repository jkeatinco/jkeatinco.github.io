const clientId = '';
const redirectUri = 'https://spottypotty.surge.sh';
// const redirectUri = 'http://localhost:3000';
let accessToken;

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
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
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name})

            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                // Get the modal
                var modal = document.getElementById("myModal");

                // Get the button that opens the modal
                var btn = document.getElementById("myBtn");

                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];

                // When the user clicks on the button, open the modal
                function myfunction () {
                    modal.style.display = "block";
                }
                myfunction();

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

                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris})
                })
            })
        });
    },

    topArtists() {
        const accessToken = Spotify.getAccessToken();
        let userId;
        return fetch(`https://api.spotify.com/v1/me/top/artists`,
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
                }))}).then
            (items => { 
                console.log(items);
                var name = items[0]['id'];
                var namea = items[1]['id'];
                var nameb = items[2]['id'];
                var namec = items[3]['id'];
                var named = items[4]['id'];
                var namee = items[5]['id'];
                var namef = items[6]['id'];
                var nameg = items[7]['id'];
                var nameh = items[8]['id'];
                var namei = items[9]['id'];
                // var namej = items[10]['id'];
                // var namek = items[11]['id'];
                // var namel = items[12]['id'];
                // var namem = items[13]['id'];
                // var namen = items[14]['id'];
                // var nameo = items[15]['id'];
                // var namep = items[16]['id'];
                // var nameq = items[17]['id'];
                // var namer = items[18]['id'];
                // var names = items[19]['id'];
                return Promise.all([
                    fetch(`https://api.spotify.com/v1/artists/${name}/top-tracks?country=US`,
                        {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${namea}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${nameb}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${namec}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${named}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${namee}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${namef}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${nameg}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${nameh}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    fetch(`https://api.spotify.com/v1/artists/${namei}/top-tracks?country=US`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${namej}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${namek}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${namel}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${namem}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${namen}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${nameo}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${namep}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${nameq}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${namer}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                    // fetch(`https://api.spotify.com/v1/artists/${names}/top-tracks?country=US`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${accessToken}`
                    //         }
                    //     }).then(value => value.json()),
                ])

                // return fetch(`https://api.spotify.com/v1/artists/${name}/top-tracks?country=US`,
                //     {
                //         headers: {
                //             Authorization: `Bearer ${accessToken}`
                //         }
                    // })
                    // .then(value => {
                    //     return value.json();
                    // })
                    .then(value => {
                        console.log(value);
                        if (!value[0].tracks) {
                            return [];
                        }
                        console.log(value);
                        // var resultObject = value.reduce(function (result, currentObject) {
                        //     for (var key in currentObject) {
                        //         if (currentObject.hasOwnProperty(key)) {
                        //             result[key] = currentObject[key];
                        //         }
                        //     }
                        //     return result;
                        // }, {});

                        // console.log(resultObject);

                        var a = value[0].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var b = value[1].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var c = value[2].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var d = value[3].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var e = value[4].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var f = value[5].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var g = value[6].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var h = value[7].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var i = value[8].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        var j = value[9].tracks.map(tracks => ({
                            id: tracks.id,
                            name: tracks.name,
                            artist: tracks.artists[0].name,
                            album: tracks.album.name,
                            uri: tracks.uri
                        }))
                        // var k = value[10].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var l = value[11].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var m = value[12].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var n = value[13].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var o = value[14].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var p = value[15].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var q = value[16].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var r = value[17].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var s = value[18].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        // var t = value[19].tracks.map(tracks => ({
                        //     id: tracks.id,
                        //     name: tracks.name,
                        //     artist: tracks.artists[0].name,
                        //     album: tracks.album.name,
                        //     uri: tracks.uri
                        // }))
                        var final = a.concat(b,c,d,e,f,g,h,i,j); //,k,l,m,n,o,p,q,r,s,t);
                       
                        console.log(final);
                        return final;

                       
                        
                    })
                    
                })
                
            },


                // var names = x;
                // console.log(names.object);

                // let requests = names.map(name => fetch(`https://api.spotify.com/v1/artists/${names}/top-tracks?country=US`,
                
                //     {
                //         headers: {
                //             Authorization: `Bearer ${accessToken}`
                //         }
                //     }
                
                // ));

                // Promise.all(requests)
                //     .then(responses => {
                //         // all responses are resolved successfully
                //         for (let response of responses) {
                //             alert(`${response.url}: ${response.status}`); // shows 200 for every url
                //         }

                //         return responses;
                //     })
                //     // map array of responses into an array of response.json() to read their content
                //     .then(responses => Promise.all(responses.map(r => r.json())))
                //     // all JSON answers are parsed: "users" is the array of them
                //     .then(tracks => tracks.forEach(track => alert(track.name)));


                // getAll(x);
                // async function getAll(data) {
                //     var promises = [];
                // for (var i = 0; i < 20; i++) {
                //     await promises.push(Spotify.search(x[i].id))
                // }
                //     Promise.all(promises).then(function () {
                //         console.log("done");
                //         console.log(promises[1]);
                //         // promises.map(response => response.json())
                //         // console.log(response.json());
                //         return promises.map(promises => ({
                //             id: promises.id,
                //             name: promises.name
                //             // artist: track.artist[0].name,
                //             // album: track.album.name,
                //             // uri: track.uri
                //         }))
                //     });
                   
                // }    

                // Promise.all(promises.map(function () {
                //     console.log(promises)
                //         return { id: promises.id, name: promises.name };
                //     }));

                // Promise.all(filenames.map(function (filename) {
                //     return fsPromise.readFileAsync(articlesPath + '/' + filename, 'utf8').then(function (content) {
                //         return { content: content, filename: filename };
                //     });
                // })).then(Lazy);
                    // promises.push(Spotify.search(x[i].id));
                    
                    // console.log(promises);
                    // if (i == 19) {
                    //     Promise.all([promises]).then((values) => {
                    //       return values;
                    //     }).then(
                    //     values.map(items => ({
                    //         id: items.id,
                    //         name: items.name
                    //     })))
                    //     console.log(values);
                    //     return values;
                        // console.log(promises);
                        // return promises;
                    // }
                    // if(i==19){
                    //     var mypromise = Promise.all([promises]).then((values) => {
                    //      return values;
                    //     }).then((mypromise) => {
                    //         console.log(mypromise);
                    //         console.log(mypromise[0][0]);
                    //     })
                        
                        // promises.map(items => ({
                        //     id: items.id,
                        //     name: items.name
                        // }))
                        // console.log(promises);
                        // return promises;
                    // }
                // }
                
                // return x;
            
  


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