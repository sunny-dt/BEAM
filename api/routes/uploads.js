const express = require('express');
const router = require('express-promise-router')();
const uuidv1 = require('uuid/v1');
const uuidv5 = require('uuid/v5');

const multer = require('multer');

const uploadsController = require('../controllers/uploads');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

const subpaths = require('../helpers/assests-subpaths');

const svgStorage = multer.diskStorage({
    destination : function(req, file, cb)
    {
        cb(null, '../client-assets/' + subpaths.SVG_FILES);
    },
    filename : function(req, file, cb)
    {
        const namespace = uuidv1();
        const newFilename = uuidv5(file.originalname, namespace) + '.svg';
        cb(null, newFilename);
    }

});

const svgFileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/svg+xml')
    {
        cb(null, true);
    }
    else
    {
        const err = new Error('The file is not a valid SVG');
        err.status = 409;
        err.message = "The file is not a valid SVG";
        cb(err, false);
    }
}



const svgUpload = multer({storage : svgStorage, 
                        limits : {
                                    fileSize : 1024 * 1024 * 5
                        },
                        fileFilter : svgFileFilter
                });





const featuredStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client-assets/' + subpaths.FEATURED_FILES);
    },
    filename: function (req, file, cb) {

        const extn = getFileExtension(file);

        const namespace = uuidv1();
        const newFilename = uuidv5(file.originalname, namespace) + extn;
        cb(null, newFilename);
    }

});


const latestStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client-assets/' + subpaths.LATEST_FILES);
    },
    filename: function (req, file, cb) {

        const extn = getFileExtension(file);
        const namespace = uuidv1();
        const newFilename = uuidv5(file.originalname, namespace) + extn;
        cb(null, newFilename);
    }

});

const recommendedStorage = multer.diskStorage({
    destination: function (req, file, cb) {

        const media_type = req.query['media_type'];

        let destFolder = '../client-assets/' + subpaths.METADATA_MEDIA_FILES;
        switch(media_type)
        {
            case 'image':
                destFolder = destFolder + 'img';
                break;
            case 'video':
                destFolder = destFolder + 'vid';
                break;
            case 'ppt':
                 destFolder = destFolder + 'ppt';
                 break;
            case 'doc':
                destFolder = destFolder + 'doc';
                break;
            case 'excel':
                destFolder = destFolder + 'excel';
                break;
            case 'pdf':
                destFolder = destFolder + 'pdf';
                break;

            
            default : 
                const err = new Error('Media Type selected is not valid');
                err.status = 409;
                err.message = "Media Type selected is not valid";
                cb(err, false);
                
            break;

        }
        cb(null, destFolder);
    },
    filename: function (req, file, cb) {

        const extn = getFileExtension(file);
        const namespace = uuidv1();
        const newFilename = uuidv5(file.originalname, namespace) + extn;
        cb(null, newFilename);
    }

});



const imgOnlyFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||  file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        const err = new Error('The file is not a valid PNG or JPG');
        err.status = 409;
        err.message = "The file is not a valid PNG or JPG";
        cb(err, false);
    }
};

const mediaFileFilter = (req, file, cb) => {

    const media_type = req.query['media_type'];

    if(media_type != undefined)
    {
        switch(file.mimetype)
        {
            case  'image/png':
            case  'image/jpeg':
            case  'image/jpg':
            case  'video/mp4':
            case  'application/vnd.ms-powerpoint':
            case  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            case  'application/msword':
            case  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 
            case  'application/pdf':

                    if( 
                    ((file.mimetype === 'image/png' ||  file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/jpg') && media_type != 'image')
                   
                    || ((file.mimetype === 'video/mp4' ) && media_type != 'video') 
                   
                    || ((file.mimetype === 'application/vnd.ms-powerpoint' || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') && media_type != 'ppt')
                    
                    || ((file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && media_type != 'doc')
        
                    || ((file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') && media_type != 'excel')

                    || ((file.mimetype === 'application/pdf' ) && media_type != 'pdf') 
                    )
                    {
        
                        
                        let err = new Error(`The file uploaded is not a ${media_type}. Please select the correct media type.`);
                        err.status = 409;
                        err.message = `The file uploaded is not a ${media_type}. Please select the correct media type.`;
                        cb(err, false);
                    }
                    else
                    {
                        cb(null, true);
                    }
        

            break;


            default : 
                const err = new Error('The file is not a valid upload type');
                err.status = 409;
                err.message = "The file is not a valid upload type";
                cb(err, false);
            break;
            
        }

    }
    else
    {
        const err = new Error('Media Type is not selected');
        err.status = 409;
        err.message = "Media Type is not selected";
        cb(err, false);

    }

    
};



const featuredUpload = multer({
    storage: featuredStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: imgOnlyFileFilter
});

const latestUpload = multer({
    storage: latestStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: imgOnlyFileFilter
});

const recommendedUpload = multer({
    storage: recommendedStorage,
    limits: {
        fileSize: 1024 * 1024 * 1024
    },
    fileFilter: mediaFileFilter
});


function getFileExtension(file)
{
    let extn = '';

    switch(file.mimetype)
    {
        case 'image/jpg':
            extn  = '.jpg';
            break;
        
        case 'image/jpeg':
            extn  = '.jpeg';
            break;
            
         case 'image/png':
            extn  = '.png';
            break;  
            
        case 'video/mp4':
            extn  = '.mp4';
            break;

        case 'application/vnd.ms-powerpoint':
            extn  = '.ppt';
            break;

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            extn  = '.pptx';
            break;

        case 'application/msword':
            extn = '.doc';
            break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            extn = '.docx';
            break;

        case 'application/vnd.ms-excel':
            extn = '.xls';
            break;

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 
            extn = '.xlsx';
            break;

        case  'application/pdf':
            extn = '.pdf';
            break;





    }

    return extn;
}


// router.post("/", upload.single('modelSvg'), (req, res, next) => {

//     console.debug('successfully saved the uploaded svg ', req.file);
//     const response = {url : process.env.CLIENT_ASSETS_BASE_URI + req.file.filename, filename : req.file.filename};
//     console.debug(`sent 201 success response to client with json ${JSON.stringify(response)}`);
//     res.status(201).json(response);
// })

router.route('/')
    .post([authorize([roles.SuperAdmin]), svgUpload.single('modelSvg')], uploadsController.newUpload);

router.route('/featured')
      .post([authorize([roles.SuperAdmin]), featuredUpload.single('featuredPng')], uploadsController.newFeaturedUpload);

router.route('/latest')
      .post([authorize([roles.SuperAdmin]), latestUpload.single('latestPng')], uploadsController.newLatestUpload);

router.route('/recommended')
.post([authorize([roles.SuperAdmin]), recommendedUpload.single('recommendedPng')], uploadsController.newRecommendedUpload);




module.exports = router;