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



const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

var storage = multer.diskStorage({
    destination: function (req, file, callBack) {
        if (file.fieldname == 'image') {
            callBack(null, './upload/images/');
        } else if (file.fieldname == 'video') {
            callBack(null, './upload/videos/');
        }
    },
    filename: function (req, file, callBack) {
        callBack(null, `${file.fieldname}_${file.originalname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

var upload = multer({ storage: storage });

app.use('/image', express.static('upload/images/'));
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

    const createAllTableQuery = `create table if not exists ${DATABASE}.${ALL_INFO}(
        id int(255) not null auto_increment,
        name varchar(255),
        phone_number varchar(255),
        email varchar(255),
        password varchar(255),
        role varchar(255),
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
            db.query(query, { name: name, phone_number: phone_number, email: email, password: password, role: role }, (error) => {
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
        phone_number varchar(255),
        email varchar(255),
        password varchar(255),
        role varchar(255),
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
                db.query(query, { name: name, phone_number: phone_number, email: email, password: password, role: role }, (error) => {
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
        phone_number varchar(255),
        email varchar(255),
        password varchar(255),
        role varchar(255),
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
                db.query(query, { name: name, phone_number: phone_number, email: email, password: password, role: role }, (error) => {
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
    const fetchQuery = `SELECT phone_number, password ,name, role FROM ${ALL_INFO} WHERE phone_number=${phone_number}`;
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
                console.log(sqlPassword);
            });
            var match = await bcrypt.compare(password, sqlPassword);
            if (match && phone_number == sqlPhone) {
                res.status(200).json({
                    status: 'success',
                    message: 'login successful',
                    data: result,
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

    var uid;
    var userName;
    const userNumber = req.query.phone_number;
    const house_id = req.query.house_id;
    const owner_name = req.query.owner_name;
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
                userName = data.name;

                const getHouseInfoQuery = `select * from ${OWNER_TABLE} where id = "${house_id}"`;
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
                            const image = data.image;
                            const category = data.category;
                            const fee = data.fee;
                            const quantity = data.quantity;
                            const advance_fee = data.advance_fee;
                            const electricity_fee = data.electricity_fee;
                            const gas_fee = data.gas_fee;
                            const others_fee = data.others_fee;
                            const address = data.address;
                            const notice = data.notice;
                            const status = data.status;
                            const houseId = data.house_id;
                            const time = data.time;

                            const updateOwnerTableQuery = `update ${OWNER_TABLE} set status = 'booked', can_book = 'false' where id = ${house_id}`;
                            db.query(updateOwnerTableQuery, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.json({
                                        status: 'fail',
                                        message: 'fail to update owner table'
                                    });
                                } else {
                                    const updateSingleOwnerTableQuery = `update owner_table_${owner_number}_${owner_name} set status = 'booked', can_book = 'false' where id = ${houseId}`;
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
                                                 fee varchar (255),
                                                 quantity varchar (255),
                                                 advance_fee varchar (255),
                                                 electricity_fee varchar (255),
                                                 gas_fee varchar (255),
                                                 others_fee varchar (255),
                                                 address varchar (255),
                                                 notice varchar (255),
                                                 status varchar (255),
                                                 can_book varchar(255),
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
                                                        'can_book': 'false',
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
                                                                fee varchar (255),
                                                                quantity varchar (255),
                                                                advance_fee varchar (255),
                                                                electricity_fee varchar (255),
                                                                gas_fee varchar (255),
                                                                others_fee varchar (255),
                                                                address varchar (255),
                                                                notice varchar (255),
                                                                status varchar (255),
                                                                can_book varchar (255),
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
                                                                        'can_book': 'false',
                                                                        'time': time,
                                                                    }, (error) => {
                                                                        if (error) {
                                                                            console.log(error);
                                                                            res.json({
                                                                                status: 'fail',
                                                                                message: 'fail to set book room table to owner'
                                                                            });
                                                                        } else {
                                                                            res.status(200).json({
                                                                                status: 'success',
                                                                                message: 'room booked'
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

//show booked house
app.get('/showBookedHouse', (req, res) => {
    const phoneNumber = req.query.phone_number;
    const userName = req.query.name;

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

    const id = req.query.id;
    const userName = req.query.user_name;
    const userNumber = req.query.user_number;

    const getRoomInfo = `select * from ${userNumber}_${userName}_booked_table where id = ${id}`;
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
                ownerName = data.owner_name;
                ownerNumber = data.owner_number;

                const requestQuery = `create table if not exists leave_request_list_${ownerNumber}_${ownerName}(
        id int(255) not null auto_increment primary key,
        request_id int(255),
        house_id int(255),
        owner_name varchar (255),
        owner_number varchar (255),
        user_name varchar (255),
        user_number varchar (255),
        category varchar (255),
        fee varchar (255),
        address varchar (255)
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
                            request_id: id,
                            house_id: houseId,
                            owner_name: ownerName,
                            owner_number: ownerNumber,
                            user_name: userName,
                            user_number: userNumber,
                            category: category,
                            fee: fee,
                            address: address,
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

// ===============================================================================================//
//House owner

//add house
app.post('/owner/addHouse', upload.fields([
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
                ownerName = data.name;
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
        fee varchar(255),
        quantity varchar(255),
        advance_fee varchar(255),
        electricity_fee varchar(255),
        gas_fee varchar(255),
        others_fee varchar(255),
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
        fee varchar(255),
        quantity varchar(255),
        advance_fee varchar(255),
        electricity_fee varchar(255),
        gas_fee varchar(255),
        others_fee varchar(255),
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
    const name = req.query.name;
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
    const ownerName = req.query.owner_name;
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
    const ownerName = req.query.owner_name;
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


//get leave request
app.get('/owner/leaveRoomRequests', (req, res) => {
    const ownerName = req.query.owner_name;
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
    const userName = req.query.user_name;
    const userNumber = req.query.user_number;
    const ownerName = req.query.owner_name;
    const ownerNumber = req.query.owner_number;

    const approveRequestQuery = `delete from leave_request_list_${ownerNumber}_${ownerName} where request_id = ${requestId}`;
    db.query(approveRequestQuery, (error) => {
        if (error) {
            console.log(error);
            res.json({
                status: 'fail',
                message: 'approve fail try again later'
            });
        } else {
            const deleteFromUserQuery = `delete from ${userNumber}_${userName}_booked_table where house_id = ${houseID}`;
            db.query(deleteFromUserQuery, (error) => {
                if (error) {
                    console.log(error);
                    res.json({
                        status: 'fail',
                        message: 'fail to approve try again later'
                    });
                } else {
                    const deleteFromOwnerQuery = `delete from owner_${ownerNumber}_${ownerName}_booked_room_list where house_id = ${houseID}`;
                    db.query(deleteFromOwnerQuery, (error) => {
                        if (error) {
                            console.log(error);
                            res.json({
                                status: 'fail',
                                message: 'fail to approve try again'
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

});


// app.post('/owner/photo', upload.fields([
//     { name: 'image', maxCount: 4 },
//     { name: 'video', maxCount: 1 },
// ]), (req, res) => {
//     let imageLink1;
//     let imageLink2;
//     let imageLink3;
//     let imageLink4;
//     let videoLink;

//     imageLink1 = req.files['image'][0].filename;
//     imageLink2 = req.files['image'][1].filename;
//     imageLink3 = req.files['image'][2].filename;
//     imageLink4 = req.files['image'][3].filename;
//     videoLink = req.files['video'][0].filename;
//     res.send(videoLink);

// });

// app.get('/owner/photo', (req, res) => {
//     const q = `select * from test`;
//     db.query(q, (error, result) => {
//         if (error) {
//             console.log(error);
//             res.send('error');
//         } else {
//             res.send(result);
//         }
//     });
// });

// ================================================================================================//
// all user


//get profile
app.get('/profile', (req, res) => {
    const phoneNumber = req.query.phone_number;
    const query = `SELECT * FROM ${USERS_INFO} WHERE phone_number=${phoneNumber}`;
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

//get house


//listen port
app.listen(PROT, () => {
    console.log('server running');
});