const publishHouseModel = require("../model/publishHouseModel");

const uploadPublishHouseData = require("../../../../utils/publishHouseFile");


const { uid } = require("uid");
const mongoose = require("mongoose");
const lodgeUploadId = uid();

const publishHouse = async (req, res, next) => {
  const user = req.user;
  console.log(req.body);
  const {
    houseOverview,
    aboutHouse,
    houseFeatures,
    mediaUpload,
    rentalPrice
  } = req.body;

  if (!user) {
    res.status(401).json({
      title: "Publish House Message",
      status: 401,
      successfull: false,
      message: "You are not authorized to continue."
    });
    return;
  }

  try {
    if (
      !houseOverview ||
      !aboutHouse ||
      !houseFeatures ||
      !mediaUpload ||
      !rentalPrice
    ) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message:
          "houseOverview, aboutHouse,houseFeatures, mediaUpload, rentalPrice fields is needed to continue."
      });

      return;
    }

    if (
      !(houseOverview instanceof Object) ||
      !(aboutHouse instanceof Object) ||
      !(houseFeatures instanceof Object) ||
      !(mediaUpload instanceof Object) ||
      !(rentalPrice instanceof Object)
    ) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message: "Json format is needed to parse data."
      });

      return;
    }

    if (isDataIsNull(houseOverview)) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message:
          " houseName,houseAddress,houseType,state,localGovtArea fields are required in house feature object."
      });
      return;
    }

    if (isDataIsNull(aboutHouse)) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message: "description field is required in aboutHouse object."
      });
      return;
    }

    if (isDataIsNull(houseFeatures)) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message:
          "  totalNumberOfBedRooms,totalNumberOfToilets,houseFenced,runningWater,prepaidMeter,smartHomeFeatures,laundryRoom,airConditioning,parkingSpace,garbageDisposalService,adequateLigting,storageSpace,petFriendly,emergencyExits,secureWindowsAndDoors,securitySystems,backyardGardenOrBalcony,swimmingPoolGym,Gym, maintenanceSupport,safePlayAreaForChildren fields are needed for houseFeatures object."
      });
      return;
    }

    if (isDataIsNull(mediaUpload)) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message:
          "houseImagesBase64, houseVideosbase64 fields are needed object."
      });
      return;
    }

    if (!checkIfDataIsBase64(mediaUpload)) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message:
          "base64 string is required for image upload in mediaUpload object"
      });
      return;
    }

    if (isDataIsNull(rentalPrice)) {
      res.status(400).json({
        title: "Publish House Message",
        status: 400,
        successfull: false,
        message:
          " monthlyOrYearlyRent,securityDeposit,applicationFee,maintenanceFee,petFees,rentalTerm,cleaningServices,totalDue  fields are needed in rentalPrice object."
      });
      return;
    }

    const mediaRefUrl = await uploadAllData(
      [mediaUpload.houseImagesBase64, mediaUpload.houseVideosbase64],
      user._id
    );

    const publishHouse = new publishHouseModel({
      publisher: user._id,
      datePublished: Date.now(),
      houseOverview,
      aboutHouse,
      houseFeatures,
      mediaUpload: mediaRefUrl,
      rentalPrice
    });

    await publishHouse.save();

    res.status(200).json({
      title: "Publish House Message",
      status: 200,
      successfull: "true",
      message: "successfully published a house.",
      publishHouse
    });
  } catch (err) {
    next(err);
  }
};

const getAllPublishedHouses = async (req, res, next) => {
  try {
    const houses = await publishHouseModel.find().populate('publisher',['userName','userProfile','isOnline','timeCreated'
    ]).sort({ datePublished: -1 });

    res.status(200).json({
      title: "All Houses Published Message.",
      status: 200,
      successfull: true,
      message: "successfully fetched.",
      totalHousesPublished: houses.length,
      housesPublished: houses
    });
  } catch (err) {
    res.status(500).json({
      title: "All Houses Published Message.",
      status: 500,
      successfull: false,
      message: "An error occurred",
      error: err.message
    });
  }
};









const getHousesPublishedByAgent = async (req, res, next) => {
  const { publisherId } = req.body;
  try {
    if (!publisherId) {
      res.status(400).json({
        title: "Get Published Houses By Agent Message.",
        status: 400,
        successfull: false,
        message: "publisherId field is required to continue process."
      });

      return;
    }

    const isAgentIdValid = mongoose.Types.ObjectId.isValid(publisherId);

    if (!isAgentIdValid) {
      res.status(400).json({
        title: "Get Published Houses By Agent Message.",
        status: 400,
        successfull: false,
        message: "publisherId is invalid."
      });

      return;
    }

    const houses = await publishHouseModel
      .find({ publisher: publisherId })
      .sort({ datePublished: -1 });

    res.status(200).json({
      title: "Get Published Houses By Agent Message.",
      status: 200,
      successfull: true,
      message: "successfully fetched.",
      totalHousesPublished: houses.length,
      housesPublished: houses
    });
  } catch (err) {
    res.status(500).json({
      title: "Get Published Houses By Agent Message.",
      status: 500,
      successfull: false,
      message: "An error occurred",
      error: err.message
    });
  }
};

const checkIfDataIsBase64 = data => {
  var regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  const isBase64 = Object.values(data).some(value => {
    const result = Object.values(value).some(data => {
      return regexBase64.test(data.fileData);
    });

    return result;
  });

  return isBase64;
};

const isDataIsNull = data => {
  if (Object.keys(data).length === 0) {
    return true;
  }

  const result = Object.values(data).some(value => {
    return (
      value === null || value === undefined || value === "" || value === " "
    );
  });

  return result;
};

const uploadAllData = async (data, userId) => {
  const promises = [];

  data.forEach((element, index) => {
    element.forEach(result => {
      if (index === 0) {
        promises.push(
          uploadPublishHouseData(
            result.fileData,
            `images/${userId}/${lodgeUploadId}/${uid(16)}.jpeg`,
            "image",
            lodgeUploadId
          )
        );
      } else {
        promises.push(
          uploadPublishHouseData(
            result.fileData,
            `videos/${userId}/${lodgeUploadId}/${uid(16)}.mp4`,
            "video",
            lodgeUploadId
          )
        );
      }
    });
  });

  return Promise.all(promises);
};

module.exports = { publishHouse, getAllPublishedHouses,getHousesPublishedByAgent };
