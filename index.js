//url
const BASE_URL = 'http://localhost:5000'
//server information
const PROT = 5000;
//database information
const HOST = 'localhost';
const DATABASE = 'rent_house';
const USER = 'root';
//table information
const ALL_INFO = 'all_info';
const USERS_INFO = 'users_info';
const OWNERS_INFO = 'owners_info';
const OWNER_TABLE = 'owner_table';
//import library
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { reset } = require('nodemon');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { error, log } = require('console');
const { ifError } = require('assert');



const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

var uploadHouseImageStorage = multer.diskStorage({
    destination: function (req, file, callBack) {
        if (file.fieldname == 'image') {
            callBack(null, './upload/images/');
        } else if (file.fieldname == 'video') {
            callBack(null, './upload/videos/');
        }
    },
    filename: function (req, file, callBack) {
        callBack(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});


var profilePicStorage = multer.diskStorage({
    destination: function (req, file, callBack) {
        if (file.fieldname == 'profileImage') {
            callBack(null, './upload/profiles/');
        }
    },
    filename: function (req, file, callBack) {
        callBack(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

var uploadHouseImages = multer({ storage: uploadHouseImageStorage });
var uploadProfilePic = multer({ storage: profilePicStorage });

app.use('/image', express.static('upload/images/'));
app.use('/profileImage', express.static('upload/profiles/'));
app.use('/video', express.static('upload/videos/'));
//create database
const db = mysql.createConnection({
    host: HOST,
    database: DATABASE,
    user: USER,
    password: '',
});

//connect database
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('database connected');
    }
});

//variables
let sqlPhone = '';
let sqlPassword = '';


//home
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Home',
    });
});



//register
app.post('/register', (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const name = req.query.name;
    const phone_number = req.query.phone_number;
    const email = req.query.email;
    const password = bcrypt.hashSync(req.query.password, salt);
    const role = req.query.role;
    const deviceToken = req.query.device_token;

    const createAllTableQuery = `create table if not exists ${DATABASE}.${ALL_INFO}(
        id int(255) not null auto_increment,
        name varchar(255),
        real_name varchar(255),
        phone_number varchar(255),
        email varchar(255),
        password varchar(255),
        role varchar(255),
        profile_pic varchar(255),
        device_token varchar(255),
        primary key(id)
    );`;
    db.query(createAllTableQuery, (error) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'Database create fail. Try again later',
            });
        } else {
            //insert into database
            const query = `insert into ${ALL_INFO} set ?`
            db.query(query, {
                name: name.replace(' ', '_').toLowerCase(),
                real_name: name,
                phone_number: phone_number,
                email: email,
                password: password,
                role: role,
                profile_pic: '',
                device_token: deviceToken,
            }, (error) => {
                if (error) {
                    res.json({
                        status: 'fail',
                        message: 'Fail to register',
                    });
                    console.log(error);
                } else {
                    console.log(`registered ${role}`);
                    res.status(200).json({
                        status: 'success',
                        message: 'Registration success',
                    });
                }
            });
        }
    });

    //create table
    if (role == 'user') {
        const createUserTableQuery = `create table if not exists ${DATABASE}.${USERS_INFO}(
        id int(255) not null auto_increment,
        name varchar(255),
        real_name varchar(255),
        phone_number varchar(255),
        email varchar(255),
        password varchar(255),
        role varchar(255),
        profile_pic varchar(255),
        device_token varchar(255),
        primary key(id)
    );`;
        db.query(createUserTableQuery, (error) => {
            if (error) {
                console.log(error);
                res.json({
                    status: 'fail',
                    message: 'Database create fail. Try again later',
                });
            } else {
                //insert into database
                const query = `insert into ${USERS_INFO} set ?`
                db.query(query, {
                    name: name.replace(' ', '_').toLowerCase(),
                    real_name: name,
                    phone_number: phone_number,
                    email: email,
                    password: password,
                    role: role,
                    profile_pic: '',
                    device_token: deviceToken,
                }, (error) => {
                    if (error) {
                        res.json({
                            status: 'fail',
                            message: 'Fail to register',
                        });
                        console.log(error);
                    } else {
                        console.log(`registered ${role}`);
                        res.json({
                            status: 'success',
                            message: 'Registration success',
                        });
                    }
                });
            }
        });
    } else if (role == 'owner') {
        const createOwnerTableQuery = `create table if not exists ${DATABASE}.${OWNERS_INFO}(
        id int(255) not null auto_increment,
        name varchar(255),
        real_name varchar(255),
        phone_number varchar(255),
        email varchar(255),
        password varchar(255),
        role varchar(255),
        profile_pic varchar(255),
        device_token varchar(255),
        primary key(id)
    );`;
        db.query(createOwnerTableQuery, (error) => {
            if (error) {
                console.log(error);
                res.json({
                    status: 'fail',
                    message: 'Database create fail. Try again later',
                });
            } else {
                //insert into database
                const query = `insert into ${OWNERS_INFO} set ?`
                db.query(query, {
                    name: name.replace(' ', '_').toLowerCase(),
                    real_name: name,
                    phone_number: phone_number,
                    email: email,
                    password: password,
                    role: role,
                    profile_pic: '',
                    device_token: deviceToken,
                }, (error) => {
                    if (error) {
                        res.json({
                            status: 'fail',
                            message: 'Fail to register',
                        });
                        console.log(error);
                    } else {
                        console.log(`registered ${role}`);
                        res.status(200).json({
                            status: 'success',
                            message: 'Registration success',
                        });
                    }
                });
            }
        });
    }
});


//login
app.post('/login', (req, res) => {
    const phone_number = req.query.phone_number;
    const password = req.query.password;
    const deviceToken = req.query.device_token;
    var role = '';
    const fetchQuery = `SELECT * FROM ${DATABASE}.${ALL_INFO} WHERE phone_number=${phone_number}`;
    db.query(fetchQuery, async (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'invalid credential',
            });
        } else {
            Object.keys(result).forEach((key) => {
                const data = result[key];
                sqlPhone = data.phone_number;
                sqlPassword = data.password;
                role = data.role;
                console.log(sqlPassword);
            });
            var match = await bcrypt.compare(password, sqlPassword);
            if (match && phone_number == sqlPhone) {

                const updateDeviceTokenQuery = `update ${DATABASE}.${ALL_INFO} set device_token = "${deviceToken}" where phone_number = ${sqlPhone}`;
                db.query(updateDeviceTokenQuery, (error) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 'fail',
                            message: 'fail to update device token all info'
                        });
                    } else {
                        if (role == 'user') {
                            const updateDeviceTokenQueryUser = `update ${DATABASE}.${USERS_INFO} set device_token = "${deviceToken}" where phone_number = ${sqlPhone}`;
                            db.query(updateDeviceTokenQueryUser, (error) => {
                                if (error) {
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to update device token user info'
                                    });
                                } else {
                                    res.status(200).json({
                                        status: 'success',
                                        message: 'login successful',
                                        data: result,
                                    });
                                }
                            });
                        } else if (role == 'owner') {

                            const updateDeviceTokenQueryOwner = `update ${DATABASE}.${OWNERS_INFO} set device_token = "${deviceToken}" where phone_number = ${sqlPhone}`;
                            db.query(updateDeviceTokenQueryOwner, (error) => {
                                if (error) {
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to update device token owner info'
                                    });
                                } else {
                                    res.status(200).json({
                                        status: 'success',
                                        message: 'login successful',
                                        data: result,
                                    });
                                }
                            });

                        }
                    }
                });
            } else {
                res.json({
                    status: 'fail',
                    message: 'invalid credential',
                });
            }
        }
    });

});


//get house
app.get('/getHouse', (req, res) => {
    const category = req.query.category;
    const getHouseQuery = `select * from ${OWNER_TABLE} where category="${category.toLowerCase()}"`;
    db.query(getHouseQuery, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'Fail to get houses'
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'house loaded',
                data: result
            });
        }
    });

});

//book house
app.post('/bookHouse', (req, res) => {

    const userName = req.query.user_name.replace(' ', '_').toLowerCase();
    const userNumber = req.query.phone_number;
    const house_id = req.query.house_id;
    const owner_name = req.query.owner_name.replace(' ', '_').toLowerCase();
    const owner_number = req.query.owner_number;
    var time;

    const getUserInfoQuery = `select * from ${USERS_INFO} where phone_number = ${userNumber}`;
    db.query(getUserInfoQuery, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to book house'
            });
        } else {
            Object.keys(result).forEach((key) => {
                const data = result[key];
                deviceToken = data.device_token;
                console.log(deviceToken);
                const query = `select * from owner_table_${owner_number}_${owner_name} where id = ${house_id}`;
                db.query(query, (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 'fail',
                            message: 'fail to book house'
                        });
                    } else {
                        Object.keys(result).forEach((key) => {
                            const data = result[key];
                            time = data.time;
                            const bookRoomReqQuery = `create table if not exists room_book_request_${owner_number}_${owner_name}(
        id int(255) primary key auto_increment,
        user_name varchar(255),
        user_number varchar(255),
        house_id int(255),
        time varchar(255)
    );`;

                            db.query(bookRoomReqQuery, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to sent request'
                                    });
                                } else {
                                    const insert = `insert into room_book_request_${owner_number}_${owner_name} set ?`;
                                    db.query(insert, {
                                        user_name: userName,
                                        user_number: userNumber,
                                        house_id: house_id,
                                        time: time,
                                    }, (error) => {
                                        if (error) {
                                            console.log(error);
                                            res.json({
                                                status: 'fail',
                                                message: 'fail to insert request data'
                                            });
                                        } else {
                                            res.json({
                                                status: 'success',
                                                message: 'request sent'
                                            });
                                        }
                                    });

                                }
                            });
                        });
                    }
                });

            });
        }
    });

});

//show booked house
app.get('/showBookedHouse', (req, res) => {
    const phoneNumber = req.query.phone_number;
    const userName = req.query.name.replace(' ', '_').toLowerCase();

    const query = `select * from ${phoneNumber}_${userName}_booked_table`;
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to show booked house'
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'booked house loaded',
                data: result
            });
        }
    });
});



//send room leave request
app.post('/leaveRoom', (req, res) => {
    var ownerName = '';
    var ownerNumber = '';

    const bookedRoomID = req.query.id;
    const userName = req.query.user_name.replace(' ', '_').toLowerCase();
    const userNumber = req.query.user_number;


    const getUserInfoQuery = `select * from ${USERS_INFO} where phone_number = ${userNumber}`;
    db.query(getUserInfoQuery, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get user info'
            });
        } else {
            Object.keys(result).forEach((key) => {
                const data = result[key];

                const getRoomInfo = `select * from ${userNumber}_${userName}_booked_table where id = ${bookedRoomID}`;
                db.query(getRoomInfo, (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 'fail',
                            message: 'fail to get room info'
                        });
                    } else {

                        Object.keys(result).forEach((key) => {
                            const data = result[key];
                            const category = data.category;
                            const fee = data.fee;
                            const address = data.address;
                            const houseId = data.house_id;
                            ownerName = data.owner_name.replace(' ', '_').toLowerCase();
                            ownerNumber = data.owner_number;
                            const time = data.time;

                            const requestQuery = `create table if not exists leave_request_list_${ownerNumber}_${ownerName}(
        id int(255) not null auto_increment primary key,
        request_id int(255),
        house_id int(255),
        owner_name varchar (255),
        owner_number varchar (255),
        user_name varchar (255),
        user_number varchar (255),
        category varchar (255),
        fee int (255),
        address varchar (255),
        time varchar (255)
      );`;

                            db.query(requestQuery, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to send request'
                                    });
                                } else {
                                    const addData = `insert into leave_request_list_${ownerNumber}_${ownerName} set ?`;
                                    db.query(addData, {
                                        request_id: bookedRoomID,
                                        house_id: houseId,
                                        owner_name: ownerName,
                                        owner_number: ownerNumber,
                                        user_name: userName,
                                        user_number: userNumber,
                                        category: category,
                                        fee: fee,
                                        address: address,
                                        time: time,
                                    }, (error) => {
                                        if (error) {
                                            console.log(error);
                                            res.json({
                                                status: 'fail',
                                                message: 'fail to add data'
                                            });
                                        } else {
                                            res.status(200).json({
                                                status: 'success',
                                                message: 'request sent'
                                            });
                                        }
                                    });
                                }
                            });

                        });
                    }
                });
            });
        }
    });
});

// ===============================================================================================//
//House owner



//add house
app.post('/owner/addHouse', uploadHouseImages.fields([
    { name: 'image', maxCount: 4 },
    { name: 'video', maxCount: 1 },
]), (req, res) => {
    var ownerName = '';
    var uid = '';
    let image1;
    let image2;
    let image3;
    let image4;
    let videoLink;
    const ownerNumber = req.query.owner_number;
    const category = req.query.category;
    const fee = req.query.fee;
    const quantity = req.query.quantity;
    const advanceFee = req.query.advance_fee;
    const electricityFee = req.query.electricity_fee;
    const gasFee = req.query.gas_fee;
    const othersFee = req.query.others_fee;
    const address = req.query.address;
    const notice = req.query.notice;
    const status = req.query.status;
    const canBook = req.query.canBook;
    const time = Date.now();

    const getOwnerInfo = `select * from ${OWNERS_INFO} where phone_number=${ownerNumber}`;
    db.query(getOwnerInfo, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get owner info'
            });
        } else {
            image1 = `${BASE_URL}/image/${req.files['image'][0].filename}`;
            image2 = `${BASE_URL}/image/${req.files['image'][1].filename}`;
            image3 = `${BASE_URL}/image/${req.files['image'][2].filename}`;
            image4 = `${BASE_URL}/image/${req.files['image'][3].filename}`;
            videoLink = `${BASE_URL}/video/${req.files['video'][0].filename}`;

            Object.keys(result).forEach((key) => {
                const data = result[key];
                ownerName = data.name.replace(' ', '_').toLowerCase();
                uid = data.id;

                //add house into single owners
                const createSingleOwnerTableQuery = `create table if not exists ${DATABASE}.${OWNER_TABLE}_${ownerNumber}_${ownerName}(
        id int(255) not null auto_increment,
        owner_name varchar(255),
        owner_number varchar(255),
        owner_id int(255),
        image1 varchar(255),
        image2 varchar(255),
        image3 varchar(255),
        image4 varchar(255),
        video varchar(255),
        category varchar(255),
        fee int(255),
        quantity varchar(255),
        advance_fee int(255),
        electricity_fee int(255),
        gas_fee int(255),
        others_fee int(255),
        address varchar(255),
        notice varchar(255),
        can_book varchar(255),
        status varchar(255),
        time varchar(255),
        primary key(id)
    );`;

                db.query(createSingleOwnerTableQuery, (error) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 'fail',
                            message: 'Fail to create your house'
                        });
                    } else {
                        const addHouseQuery = `insert into ${OWNER_TABLE}_${ownerNumber}_${ownerName} set?`;
                        db.query(addHouseQuery, {
                            owner_name: ownerName,
                            owner_number: ownerNumber,
                            owner_id: uid,
                            image1: image1,
                            image2: image2,
                            image3: image3,
                            image4: image4,
                            video: videoLink,
                            category: category,
                            fee: fee,
                            quantity: quantity,
                            advance_fee: advanceFee,
                            electricity_fee: electricityFee,
                            gas_fee: gasFee,
                            others_fee: othersFee,
                            address: address,
                            notice: notice,
                            status: status,
                            can_book: canBook,
                            time: time,
                        }, (error) => {
                            if (error) {
                                console.log(error);
                                res.json({
                                    status: 'fail',
                                    message: 'fail to add house'
                                });
                            } else {
                                const getHouseId = `select * from ${OWNER_TABLE}_${ownerNumber}_${ownerName} where time = ${time}`;
                                db.query(getHouseId, (error, result) => {
                                    if (error) {
                                        console.log(error);
                                        res.json({
                                            status: 'fail',
                                            message: 'fail to get house id'
                                        });
                                    } else {
                                        Object.keys(result).forEach((key) => {
                                            const data = result[key];
                                            var houseID = data.id;
                                            //save all owners houses
                                            const allOwnersHouseQuery = `create table if not exists ${DATABASE}.${OWNER_TABLE}(
        id int(255) not null auto_increment primary key,
        owner_name varchar(255),
        owner_id int(255),
        owner_number varchar(255),
        image1 varchar(255),
        image2 varchar(255),
        image3 varchar(255),
        image4 varchar(255),
        video varchar(255),
        category varchar(255),
        fee int(255),
        quantity varchar(255),
        advance_fee int(255),
        electricity_fee int(255),
        gas_fee int(255),
        others_fee int(255),
        address varchar(255),
        notice varchar(255),
        status varchar(255),
        can_book varchar(255),
        house_id int(255),
        time varchar(255)
        );`;

                                            db.query(allOwnersHouseQuery, (error) => {
                                                if (error) {
                                                    console.log(error);
                                                    res.json({
                                                        status: 'fail',
                                                        message: 'Fail to cerate all owners house table'
                                                    });
                                                } else {
                                                    const addAllOwnersHouseQuery = `insert into ${OWNER_TABLE} set?`;
                                                    db.query(addAllOwnersHouseQuery, {
                                                        owner_name: ownerName,
                                                        owner_id: uid,
                                                        owner_number: ownerNumber,
                                                        image1: image1,
                                                        image2: image2,
                                                        image3: image3,
                                                        image4: image4,
                                                        video: videoLink,
                                                        category: category,
                                                        fee: fee,
                                                        quantity: quantity,
                                                        advance_fee: advanceFee,
                                                        electricity_fee: electricityFee,
                                                        gas_fee: gasFee,
                                                        others_fee: othersFee,
                                                        address: address,
                                                        notice: notice,
                                                        status: status,
                                                        can_book: canBook,
                                                        house_id: houseID,
                                                        time: time,
                                                    }, (error) => {
                                                        if (error) {
                                                            console.log(error);
                                                            res.json({
                                                                status: 'fail',
                                                                message: 'Fail to insert all owners house table'
                                                            });
                                                        } else {
                                                            console.log(canBook);
                                                            res.status(200).json({
                                                                status: 'success',
                                                                message: 'house inserted'
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
});

//show owner house
app.get('/owner/showOwnerHouse', (req, res) => {
    const name = req.query.name.replace(' ', '_').toLowerCase();
    const ownerNumber = req.query.owner_number;
    const query = `select * from ${OWNER_TABLE}_${ownerNumber}_${name}`;
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'no room found'
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'owner house loaded',
                data: result
            });
        }
    });
});

//show who booked table
app.get('/owner/showBookedHouse', (req, res) => {
    const ownerName = req.query.owner_name.replace(' ', '_').toLowerCase();
    const ownerNumber = req.query.owner_number;

    const query = `select * from owner_${ownerNumber}_${ownerName}_booked_room_list`;
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get booked table list'
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'owners booked house loaded',
                data: result,
            });
        }
    });

});

//update house
app.put('/owner/updateHouse', (req, res) => {
    const houseId = req.query.house_id;
    const ownerName = req.query.owner_name.replace(' ', '_').toLowerCase();
    const ownerNumber = req.query.owner_number;
    const category = req.query.category;
    const fee = req.query.fee;
    const quantity = req.query.quantity;
    const advanceFee = req.query.advance_fee;
    const electricityFee = req.query.electricity_fee;
    const gasFee = req.query.gas_fee;
    const othersFee = req.query.others_fee;
    const address = req.query.address;
    const notice = req.query.notice;
    const status = req.query.status;
    const canBook = req.query.canBook;

    const getOwnerTableId = `select * from owner_table_${ownerNumber}_${ownerName} where id = ${houseId}`;
    db.query(getOwnerTableId, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get owner table id'
            });
        } else {
            Object.keys(result).forEach((key) => {
                const data = result[key];
                const time = data.time;
                const updateHouseSingle = `update ${OWNER_TABLE}_${ownerNumber}_${ownerName} set? where id=${houseId}`;
                db.query(updateHouseSingle, {
                    category: category,
                    fee: fee,
                    quantity: quantity,
                    advance_fee: advanceFee,
                    electricity_fee: electricityFee,
                    gas_fee: gasFee,
                    others_fee: othersFee,
                    address: address,
                    notice: notice,
                    can_book: canBook,
                    status: status,
                }, (error) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 'fail',
                            message: 'fail to update house single'
                        });
                    } else {
                        const updateHouse = `update ${OWNER_TABLE} set? where time=${time}`;
                        db.query(updateHouse, {
                            category: category,
                            fee: fee,
                            quantity: quantity,
                            advance_fee: advanceFee,
                            electricity_fee: electricityFee,
                            gas_fee: gasFee,
                            others_fee: othersFee,
                            address: address,
                            notice: notice,
                            status: status,
                            can_book: canBook,
                        }, (error) => {
                            if (error) {
                                console.log(error);
                                res.json({
                                    status: 'fail',
                                    message: 'fail to update house'
                                });
                            } else {
                                res.status(200).json({
                                    status: 'success',
                                    message: 'house updated'
                                });
                            }
                        });
                    }
                });
            });
        }
    });
});

//get single house
app.get('/owner/getSingleHouse', (req, res) => {
    const owner_name = req.query.owner_name.replace(' ', '_').toLowerCase();
    const owner_number = req.query.owner_number;
    const time = req.query.time;

    const query = `select * from owner_table_${owner_number}_${owner_name} where time = ${time}`;
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get data'
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'house loaded',
                data: result
            });
        }
    });
});

//get book room request
app.get('/owner/bookRoomRequest', (req, res) => {
    const ownerName = req.query.owner_name.replace(' ', '_').toLowerCase();
    const ownerNumber = req.query.owner_number;

    const query = `select * from room_book_request_${ownerNumber}_${ownerName}`;
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get room request'
            });
        } else {
            res.json({
                status: 'success',
                message: 'book room requests',
                data: result
            });
        }
    });

});

//approve book room request
app.post('/owner/approveBookRoomRequest', (req, res) => {
    var uid;
    var userName;
    const userNumber = req.query.phone_number;
    const time = req.query.time;
    const owner_name = req.query.owner_name.replace(' ', '_').toLowerCase();
    const owner_number = req.query.owner_number;

    const getUseIdQuery = `select * from ${USERS_INFO} where phone_number=${userNumber}`;
    db.query(getUseIdQuery, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get user id'
            });
        } else {
            Object.keys(result).forEach((key) => {
                const data = result[key];
                uid = data.id;
                userName = data.name.toLowerCase();

                const getHouseInfoQuery = `select * from ${OWNER_TABLE} where time = "${time}"`;
                db.query(getHouseInfoQuery, (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 'fail',
                            message: 'fail to get house details'
                        });
                    } else {
                        Object.keys(result).forEach((key) => {
                            const data = result[key];
                            const owner_id = data.owner_id;
                            const category = data.category;
                            const fee = data.fee;
                            const quantity = data.quantity;
                            const advance_fee = data.advance_fee;
                            const electricity_fee = data.electricity_fee;
                            const gas_fee = data.gas_fee;
                            const others_fee = data.others_fee;
                            const address = data.address;
                            const notice = data.notice;
                            const house_id = data.house_id;
                            const image = data.image1;
                            console.log(result);

                            const updateOwnerTableQuery = `update ${OWNER_TABLE} set status = 'booked', can_book = 'no' where time = ${time}`;
                            db.query(updateOwnerTableQuery, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to update owner table'
                                    });
                                } else {
                                    const updateSingleOwnerTableQuery = `update owner_table_${owner_number}_${owner_name} set status = 'booked', can_book = 'no' where time = ${time}`;
                                    db.query(updateSingleOwnerTableQuery, (error) => {
                                        if (error) {
                                            console.log(error);
                                            res.json({
                                                status: 'fail',
                                                message: 'fail to update table'
                                            })
                                        } else {
                                            const createBookTableQuery = `create table if not exists ${userNumber}_${userName}_booked_table(
                                                 id int(255) not null auto_increment primary key,
                                                 owner_name varchar (255),
                                                 owner_number varchar (255),
                                                 owner_id int(255),
                                                 house_id int(255),
                                                 user_id int (255),
                                                 user_name varchar (255),
                                                 user_number varchar (255),
                                                 category varchar (255),
                                                 fee int (255),
                                                 quantity varchar (255),
                                                 advance_fee int (255),
                                                 electricity_fee int (255),
                                                 gas_fee int (255),
                                                 others_fee int (255),
                                                 address varchar (255),
                                                 notice varchar (255),
                                                 status varchar (255),
                                                 can_book varchar(255),
                                                 image varchar(255),
                                                 time varchar (255)
                                                 );`;
                                            db.query(createBookTableQuery, (error) => {
                                                if (error) {
                                                    console.log(error);
                                                    res.json({
                                                        status: 'fail',
                                                        message: 'fail to crate book room table'
                                                    });
                                                } else {
                                                    const bookRoomQuery = `insert into ${userNumber}_${userName}_booked_table set?`;
                                                    db.query(bookRoomQuery, {
                                                        'owner_name': owner_name,
                                                        'owner_number': owner_number,
                                                        'owner_id': owner_id,
                                                        'house_id': house_id,
                                                        'user_id': uid,
                                                        'user_name': userName,
                                                        'user_number': userNumber,
                                                        'category': category,
                                                        'fee': fee,
                                                        'quantity': quantity,
                                                        'advance_fee': advance_fee,
                                                        'electricity_fee': electricity_fee,
                                                        'gas_fee': gas_fee,
                                                        'others_fee': others_fee,
                                                        'address': address,
                                                        'notice': notice,
                                                        'status': 'booked',
                                                        'can_book': 'no',
                                                        'image': image,
                                                        'time': time,
                                                    }, (error) => {
                                                        if (error) {
                                                            console.log(error);
                                                            res.json({
                                                                status: 'fail',
                                                                message: 'fail to book room'
                                                            });
                                                        } else {
                                                            const createSetBookedRoomToOwnerQuery = `create table if not exists owner_${owner_number}_${owner_name}_booked_room_list(
                                                                id int(255) not null auto_increment primary key,
                                                                owner_name varchar (255),
                                                                owner_number varchar (255),
                                                                owner_id int(255),
                                                                house_id int(255),
                                                                user_id int (255),
                                                                user_name varchar (255),
                                                                user_number varchar (255),
                                                                category varchar (255),
                                                                fee int (255),
                                                                quantity varchar (255),
                                                                advance_fee int (255),
                                                                electricity_fee int (255),
                                                                gas_fee int (255),
                                                                others_fee int (255),
                                                                address varchar (255),
                                                                notice varchar (255),
                                                                status varchar (255),
                                                                can_book varchar (255),
                                                                image varchar (255),
                                                                time varchar (255)
                                                                );`;
                                                            db.query(createSetBookedRoomToOwnerQuery, (error) => {
                                                                if (error) {
                                                                    console.log(error);
                                                                    res.json({
                                                                        status: 'fail',
                                                                        message: 'fail to crate book room table to owner'
                                                                    });
                                                                } else {
                                                                    const setBookedRoomToOwnerQuery = `insert into owner_${owner_number}_${owner_name}_booked_room_list set?`;
                                                                    db.query(setBookedRoomToOwnerQuery, {
                                                                        'owner_name': owner_name,
                                                                        'owner_number': owner_number,
                                                                        'owner_id': owner_id,
                                                                        'house_id': house_id,
                                                                        'user_id': uid,
                                                                        'user_name': userName,
                                                                        'user_number': userNumber,
                                                                        'category': category,
                                                                        'fee': fee,
                                                                        'quantity': quantity,
                                                                        'advance_fee': advance_fee,
                                                                        'electricity_fee': electricity_fee,
                                                                        'gas_fee': gas_fee,
                                                                        'others_fee': others_fee,
                                                                        'address': address,
                                                                        'notice': notice,
                                                                        'status': 'booked',
                                                                        'can_book': 'no',
                                                                        'image': image,
                                                                        'time': time,
                                                                    }, (error) => {
                                                                        if (error) {
                                                                            console.log(error);
                                                                            res.json({
                                                                                status: 'fail',
                                                                                message: 'fail to set book room table to owner'
                                                                            });
                                                                        } else {
                                                                            const deleteRequestQuery = `delete from room_book_request_${owner_number}_${owner_name} where house_id = ${house_id}`;
                                                                            db.query(deleteRequestQuery, (error) => {
                                                                                if (error) {
                                                                                    console.log(error);
                                                                                    res.json({
                                                                                        status: 'fail',
                                                                                        message: 'fail to approve request'
                                                                                    });
                                                                                } else {
                                                                                    res.status(200).json({
                                                                                        status: 'success',
                                                                                        message: 'room book request approved'
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }
    });
});

//get leave request
app.get('/owner/leaveRoomRequests', (req, res) => {
    const ownerName = req.query.owner_name.replace(' ', '_').toLowerCase();
    const ownerNumber = req.query.owner_number;

    const getRequest = `select * from leave_request_list_${ownerNumber}_${ownerName}`;
    db.query(getRequest, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'fail to get request list'
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'leaved room',
                data: result,
            });
        }
    });
});



//approve request
app.delete('/owner/approveLeaveRoomRequest', (req, res) => {
    const requestId = req.query.request_id;
    const houseID = req.query.house_id;
    const userName = req.query.user_name.replace(' ', '_').toLowerCase();
    const userNumber = req.query.user_number;
    const ownerName = req.query.owner_name.replace(' ', '_').toLowerCase();
    const ownerNumber = req.query.owner_number;
    const time = req.query.time;

    const approveRequestQuery = `delete from leave_request_list_${ownerNumber}_${ownerName} where request_id = ${requestId}`;
    db.query(approveRequestQuery, (error) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'approve fail try again later'
            });
        } else {
            const deleteFromUserQuery = `delete from ${userNumber}_${userName}_booked_table where time = ${time}`;
            db.query(deleteFromUserQuery, (error) => {
                if (error) {
                    console.log(error);
                    res.json({
                        status: 'fail',
                        message: 'fail to approve try again later'
                    });
                } else {
                    const deleteFromOwnerQuery = `delete from owner_${ownerNumber}_${ownerName}_booked_room_list where time = ${time}`;
                    db.query(deleteFromOwnerQuery, (error) => {
                        if (error) {
                            console.log(error);
                            res.json({
                                status: 'fail',
                                message: 'fail to approve try again'
                            });
                        } else {
                            const updateOwnerRoom = `update ${OWNER_TABLE} set status = 'available' where time = ${time}`;
                            db.query(updateOwnerRoom, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to update single owner table'
                                    });
                                } else {
                                    const updateSingleOwnerRoom = `update owner_table_${ownerNumber}_${ownerName} set status = 'available' where time = ${time}`;

                                    db.query(updateSingleOwnerRoom, (error) => {
                                        if (error) {
                                            console.log(error);
                                            res.json({
                                                status: 'fail',
                                                message: 'fail to update single table'
                                            });
                                        } else {
                                            res.status(200).json({
                                                status: 'success',
                                                message: 'approved'
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        }
    });

});

// ================================================================================================//
// all user


//get profile
app.get('/profile', (req, res) => {
    const phoneNumber = req.query.phone_number;
    const query = `SELECT * FROM ${ALL_INFO} WHERE phone_number=${phoneNumber}`;
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'invalid user',
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'user profile loaded',
                data: result
            });
        }
    });
});


//update profile pic
app.put('/updateProfilePic', uploadProfilePic.single('profileImage'), (req, res) => {

    const phoneNumber = req.query.phone_number;
    var profileImage = `${BASE_URL}/profileImage/${req.file.filename}`;

    const query = `SELECT * FROM ${ALL_INFO} WHERE phone_number=${phoneNumber}`;
    db.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'invalid user',
            });
        } else {
            Object.keys(result).forEach(async (key) => {
                var data = result[key];
                var name = data.name.replace(' ', '_').toLowerCase();
                var realName = data.real_name;
                var phoneNumber = data.phone_number;
                var email = data.email;
                var password = data.password;
                var role = data.role;

                const updateProfileQuery = `update ${ALL_INFO} set ? where phone_number = ${phoneNumber}`;
                db.query(updateProfileQuery, {
                    name: name,
                    real_name: realName,
                    phone_number: phoneNumber,
                    email: email,
                    password: password,
                    role: role,
                    profile_pic: profileImage,
                }, (error) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 'fail',
                            message: 'fail to update profile picture',
                        });
                    } else {
                        if (role == 'user') {
                            const updateUserProfileQuery = `update ${USERS_INFO} set ? where phone_number = ${phoneNumber}`;
                            db.query(updateUserProfileQuery, {
                                name: name,
                                real_name: realName,
                                phone_number: phoneNumber,
                                email: email,
                                password: password,
                                role: role,
                                profile_pic: profileImage,
                            }, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to update user profile picture',
                                    });
                                }
                            });
                        } else if (role == 'owner') {

                            const updateUserProfileQuery = `update ${OWNERS_INFO} set ? where phone_number = ${phoneNumber}`;
                            db.query(updateUserProfileQuery, {
                                name: name,
                                real_name: realName,
                                phone_number: phoneNumber,
                                email: email,
                                password: password,
                                role: role,
                                profile_pic: profileImage,
                            }, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to update owner profile picture',
                                    });
                                }
                            });
                        }
                        res.status(200).json({
                            status: 'success',
                            message: 'profile picture updated'
                        });
                    }
                });
            });
        }
    });

});


//-------------------------------------------admin------------------------------------
app.delete('/deleteUser', (req, res) => {
    deleteUser(req, res);
});

async function deleteUser(req, res) {
    const phone_number = req.query.number;
    const role = req.query.role;
    try {
        await db.beginTransaction();

        await db.query(`DELETE FROM ${ALL_INFO} WHERE phone_number = ?`, [phone_number]);
        if (role == 'user') {
            await db.query(`DELETE FROM ${USERS_INFO} WHERE phone_number = ?`, [phone_number]);

        } else if (role == 'owner') {
            await db.query(`DELETE FROM ${OWNERS_INFO} WHERE phone_number = ?`, [phone_number]);
        }
        await db.commit();

        console.log('data deleted');
        res.json({
            status: 'success',
            message: 'data has been deleted'
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: 'fail',
            message: 'fail to delete data',
        })
    }
}


//listen port
app.listen(PROT, () => {
    console.log('server running');
});