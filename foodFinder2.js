requirejs(['node-fetch','fs'],
function   (fetch,fs) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});
// function Food(theme,price,res,fName,type,veg,vegan,halal,nonBeef,eta){
//     this.theme = theme;
//     this.price = price;
//     this.res = res;
//     this.fName = fName;
//     this.type = type;
//     this.veg = veg;
//     this.vegan = vegan;
//     this.halal = halal;
//     this.nonBeef = nonBeef;
//
//     this.getPrice = function () { return this.price;};
//     this.getTheme = function () { return this.theme; };
//     this.getRes = function () { return this.res; };
//     this.getfName = function () { return this.fName; };
//     this.getType = function () { return this.type; };
//     this.getVeg = function () { return this.veg; };
//     this.getVegan = function () { return this.vegan;};
//     this.getHalal = function () { return this.halal; };
//     this.getNonBeef = function () { return this.nonBeef; };
// }
//
// function Param(price,veg,vegan,
//                theme,halal,nonBeef){
//     this.theme = theme;
//     this.veg = veg;
//     this.vegan = vegan;
//     this.halal = halal;
//     this.nonBeef = nonBeef;
//     this.getTheme = function () { return this.theme; };
//     this.getVeg = function () { return this.veg; };
//     this.getVegan = function () { return this.vegan;};
//     this.getHalal = function () { return this.halal; };
//     this.getNonBeef = function () { return this.nonBeef; };
//
// }



function foodFinder2() {
    // console.log(sheet)
    // var resultsSheet = sheet.GetSheetDone.raw("1IDvkmUH3jOuQQFgalAL0tOn-dMoroG54eTAv4oRmEtE")
    // http://gsx2json.com/api?id=1SVLn3zaDaDPqT6q0eol8B1XbBHxsYYRBzQmcBYhr_-k&q="Side"
    // var results = resultsSheet
    // var foodSheet = GetSheetDone.labeledCols("1SVLn3zaDaDPqT6q0eol8B1XbBHxsYYRBzQmcBYhr_-k")
    let url = "http://gsx2json.com/api?id=1SVLn3zaDaDPqT6q0eol8B1XbBHxsYYRBzQmcBYhr_-k&columns=false&integers=false";
    let url2 = "http://gsx2json.com/api?id=1IDvkmUH3jOuQQFgalAL0tOn-dMoroG54eTAv4oRmEtE&columns=false&integers=false";

    var food = []
    var input = []

    fetch(url)
        .then(res => res.json())
        .then((out) => {
            food = out.rows
            //console.log('Checkout this JSON! ', out.rows);
            fetch(url2)
                .then(res => res.json())
                .then((out) => {
                    input = out.rows

                    //console.log('Checkout this JSON! ', out.rows);


                    var count = 0
                    var length = input.length-1
                    var drink = false;
                    var side = false;


                    switch (input[length].yourpreferredexperience){
                        case 'Satisfying ($$)':
                            drink = true
                            break;
                        case 'Memorable ($$$)':
                            side = true;
                            drink = true;
                            break;
                        default:
                            break;
                    }

                    var chosen = []
                    var numRestaurants = 0;
                    var restaurants = []

                    for(var i in food){
                        if((input[length].chooseyourcategory === "I'm Feeling Lucky" || food[i].theme === input[length].chooseyourcategory)
                            && (food[i].type === "Main" || (food[i].type === "Sides" && side === true) || (food[i].type === "Drink" && drink === true) )
                            &&((food[i].vegetarian === 'Y' && input[length].yourpreferredfoodtype === 'Vegetarian')
                                || ((input[length].yourpreferredfoodtype === 'Non-Vegetarian' && input[length]["yourspecificnon-vegetarianfoodtype"] === 'Halal' && food[i].halal === 'Y')
                                || (input[length].yourpreferredfoodtype === 'Non-Vegetarian' && input[length]["yourspecificnon-vegetarianfoodtype"] === 'Non-Beef' && food[i].beef === 'N')
                                || (input[length].yourpreferredfoodtype === 'Non-Vegetarian' && input[length]["yourspecificnon-vegetarianfoodtype"] === 'Non-Halal')) && food[i].vegetarian === 'N')){
                            chosen[count] = food[i]
                            if(food[i].type === "Main"){
                                numRestaurants++
                                restaurants[numRestaurants] = food[i].restaurant
                                console.log(JSON.stringify(restaurants)+"\n")

                            }
                            count++
                        }

                    }
                    function Order(price,res,fName){
                        this.price = price;
                        this.res = res;
                        this.fName = fName;
                    }
                    var random = Math.floor((Math.random() * (numRestaurants)) + 2);
                    var chosenRestaurant = restaurants[random-1]
                    var price = 0
                    var eta = 0;
                    console.log(JSON.stringify(chosenRestaurant)+"\n")
                    var final = []
                    var count2 = 0
                    for(var j in chosen){
                        console.log(JSON.stringify(chosen[j])+"\n")
                        if(chosen[j].restaurant == chosenRestaurant){
                            price+=parseFloat(parseFloat((chosen[j].price)).toFixed(2))
                            eta = parseFloat(parseFloat((chosen[j].eta)).toFixed(2))
                            var order = new Order(chosen[j].price,chosen[j].restaurant,chosen[j].foodname)
                            final[count2] = order
                            console.log("ORDER "+JSON.stringify(order)+"\n")
                            count2++

                        }
                    }


                    console.log("$ "+price.toFixed(2))
                    console.log(eta+" mins")
                    price *= input[length].numberofdiners
					document.getElementById("price").innerHTML="<Strong>Order Price:</Strong>  $" + price.toFixed(2)
					document.getElementById("eta").innerHTML="<Strong>Estimated Time of Arrival:</Strong> " + eta + " minutes"
					var orders = []
                    fs.readFile('order.json', 'utf8', function readFileCallback(err, data){
                        if (err){
                            console.log(err);
                        } else {
                            orders = JSON.parse(data); //now it an object
                            console.log(JSON.stringify(orders));
                             //add some data
                            var json = JSON.stringify(orders.concat(final)); //convert it back to json
                            fs.writeFile('order.json', json, 'utf8', function readFileCallback(err, data){
                                if (err){
                                    console.log(err);
                                } else {
                                    console.log("Done")
                                }});// write it back
                        }});

                })
                .catch(err => { throw err });
        })
        .catch(err => { throw err });



}

foodFinder2()
