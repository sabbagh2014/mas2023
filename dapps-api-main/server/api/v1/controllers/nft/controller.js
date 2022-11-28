const Joi = require("joi");
const apiError = require("../../../../helper/apiError");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { userServices } = require("../../services/user");

const { nftServices } = require("../../services/nft");
const { notificationServices } = require("../../services/notification");
const { auctionNftServices } = require("../../services/auctionNft");

const {
  findUser,
  findUserData,
} = userServices;
const {
  createNft,
  findNft,
  updateNft,
  findNft1,
  nftListWithoutShared,
  nftListWithAggregate,
  listAllNft,
  nftListWithAggregatePipeline,
  findNftWithPopulateDetails,
} = nftServices;
const {
  createNotification,
} = notificationServices;
const {
  createAuctionNft,
  findAuctionNft,
  updateAuctionNft,
  auctionNftList,
  allNftAuctionList,
} = auctionNftServices;
const activityModel = require("../../../../models/activityModel");

const commonFunction = require("../../../../helper/util");

const status = require("../../../../enums/status");

const fs = require("fs");

class nftController {

  /**
   * @swagger
   * /nft/createNft:
   *   post:
   *     tags:
   *       - USER NFT
   *     description: createAuctionNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *       - name: time
   *         description: time
   *         in: formData
   *         required: false
   *       - name: startingBid
   *         description: startingBid
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: tokenId
   *         description: tokenId
   *         in: formData
   *         required: false
   *       - name: mediaUrl
   *         description: mediaUrl
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *         required: false
   *       - name: network
   *         description: network
   *         in: formData
   *         required: false
   *       - name: mediaFile
   *         description: mediaFile
   *         in: formData
   *         required: false
   *       - name: coverImage
   *         description: coverImage
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async createAuctionNft(req, res, next) {
    const validationSchema = {
      title: Joi.string().optional(),
      tokenId: Joi.string().optional(),
      tokenName: Joi.string().optional(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().optional(),
      time: Joi.string().optional(),
      startingBid: Joi.string().optional(),
      mediaFile: Joi.string().optional(),
      coverImage: Joi.string().optional(),
      mediaType: Joi.string().optional(),
      network: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (validatedBody.mediaFile || validatedBody.coverImage) {
        validatedBody.mediaFile = await commonFunction.getSecureUrl(
          validatedBody.mediaFile
        );
        validatedBody.coverImage = await commonFunction.getSecureUrl(
          validatedBody.coverImage
        );
      }

      validatedBody.userId = userResult._id;
      let auctionNftResult = await createAuctionNft(validatedBody);
      let obj = {
        userId: userResult._id,
        nftId: auctionNftResult._id,
        tokenId: auctionNftResult.tokenId,
        title: "Create a new nft ",
        type: "MINT",
        description: "NFT MINT",
      };
      await activityModel(obj).save();
      return res.json(
        new response(auctionNftResult, responseMessage.NFT_ADDED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/viewNft/{_id}:
   *   get:
   *     tags:
   *       - USER NFT
   *     description: viewAuctionNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: false
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewAuctionNft(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findAuctionNft({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(orderResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/editNft:
   *   put:
   *     tags:
   *       - USER NFT
   *     description: editAuctionNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: false
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *       - name: time
   *         description: time
   *         in: formData
   *         required: false
   *       - name: startingBid
   *         description: startingBid
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: tokenId
   *         description: tokenId
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *         required: false
   *       - name: network
   *         description: network
   *         in: formData
   *         required: false
   *       - name: mediaFile
   *         description: mediaFile
   *         in: formData
   *         required: false
   *       - name: coverImage
   *         description: coverImage
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async editAuctionNft(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      title: Joi.string().optional(),
      tokenId: Joi.string().optional(),
      tokenName: Joi.string().optional(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().optional(),
      time: Joi.string().optional(),
      startingBid: Joi.string().optional(),
      mediaFile: Joi.string().optional(),
      coverImage: Joi.string().optional(),
      mediaType: Joi.string().optional(),
      network: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftRes = await findAuctionNft({ _id: validatedBody._id });
      if (!nftRes) {
        throw apiError.notFound(responseMessage.NFT_NOT_FOUND);
      }
      if (validatedBody.mediaFile || validatedBody.coverImage) {
        validatedBody.mediaFile = await commonFunction.getSecureUrl(
          validatedBody.mediaFile
        );
        validatedBody.coverImage = await commonFunction.getSecureUrl(
          validatedBody.coverImage
        );
      }
      let auctionNftResult = await updateAuctionNft(
        { _id: nftRes._id },
        validatedBody
      );
      return res.json(
        new response(auctionNftResult, responseMessage.UPDATE_SUCCESS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/myNftList:
   *   get:
   *     tags:
   *       - USER NFT
   *     description: myAuctionNftList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async myAuctionNftList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await auctionNftList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      if (dataResults.length == 0) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nftList:
   *   get:
   *     tags:
   *       - USER NFT
   *     description: allNftAuctionList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search ?? tokenId || tokenName || network || mediaType || title
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async allNftAuctionList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let dataResults = await allNftAuctionList(validatedBody);
      if (dataResults.docs.length == 0) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nft:
   *   post:
   *     tags:
   *       - USER BUNDLE
   *     description: createNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: true
   *       - name: bundleTitle
   *         description: bundleTitle
   *         in: formData
   *         required: true
   *       - name: bundleName
   *         description: bundleName
   *         in: formData
   *         required: true
   *       - name: donationAmount
   *         description: donationAmount
   *         in: formData
   *         required: true
   *       - name: coinName
   *         description: coinName ?? USDT || BUSD || MAS || BNB || ETH
   *         in: formData
   *         required: true
   *       - name: duration
   *         description: duration
   *         in: formData
   *         required: true
   *       - name: file
   *         description: file
   *         in: formData
   *         type: file
   *         required: true
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async createNFT(req, res, next) {
    try {
      const validatedBody = req.body;
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      validatedBody.mediaUrl = await commonFunction.getImageUrl(req.files);
      validatedBody.userId = userResult._id;
      var result = await createNft(validatedBody);
      let mesage = `A new bundle (${validatedBody.bundleName}) has been created by ${userResult.name}, with the donation amount of ${validatedBody.donationAmount} ${validatedBody.coinName} for ${validatedBody.duration}.`;
      notificattionToAllSubscriber(
        userResult.followers,
        mesage,
        validatedBody.mediaUrl
      );
      return res.json(new response(result, responseMessage.NFT_ADDED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nft/{_id}:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: viewNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewNFT(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findNftWithPopulateDetails(_id, userResult._id);
      if (nftResult.length == 0) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(nftResult[0], responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/viewNft/{_id}:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: viewNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewNft(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findNft1({ _id: _id });
      if (!nftResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(nftResult, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nft:
   *   put:
   *     tags:
   *       - USER BUNDLE
   *     description: editNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: true
   *       - name: bundleTitle
   *         description: bundleTitle
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: bundleName
   *         description: bundleName
   *         in: formData
   *         required: false
   *       - name: donationAmount
   *         description: donationAmount
   *         in: formData
   *         required: false
   *       - name: duration
   *         description: duration
   *         in: formData
   *         required: false
   *       - name: mediaUrl
   *         description: mediaUrl
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editNFT(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      bundleTitle: Joi.string().optional(),
      bundleName: Joi.string().optional(),
      tokenName: Joi.string().optional(),
      donationAmount: Joi.string().optional(),
      duration: Joi.string().optional(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().optional(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findNft({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!nftResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateNft({ _id: nftResult._id }, validatedBody);
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nft:
   *   delete:
   *     tags:
   *       - USER BUNDLE
   *     description: deleteNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async deleteNFT(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findNft({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!nftResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateNft(
        { _id: nftResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/listNFT:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: listNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: search
   *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listNFT(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithAggregatePipeline(
        validatedBody,
        userResult._id
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/bundleList:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: bundleList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: search
   *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async bundleList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithoutShared(
        validatedBody,
        userResult._id
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/listAllNft:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: listAllNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listAllNft(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let dataResults = await listAllNft(validatedBody);
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/allNftList:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: allNftList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: search
   *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async allNftList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithAggregate(
        validatedBody,
        userResult._id,
        userResult.subscribeNft
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  // /**
  //  * @swagger
  //  * /nft/allNftListWithPopulated:
  //  *   get:
  //  *     tags:
  //  *       - USER BUNDLE
  //  *     description: allNftList
  //  *     produces:
  //  *       - application/json
  //  *     parameters:
  //  *       - name: token
  //  *         description: token
  //  *         in: header
  //  *         required: true
  //  *       - name: search
  //  *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
  //  *         in: query
  //  *         required: false
  //  *     responses:
  //  *       200:
  //  *         description: Returns success message
  //  */

  async allNftListWithPopulated(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithAggregatePipeline(
        validatedBody,
        userResult._id
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }



}

module.exports = new nftController();

const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const fileAdded = await ipfs.add(
    { path: fileName, content: file },
    { cidVersion: 0, hashAlg: "sha2-256" }
  );
  const fileHash = fileAdded.cid.toString();
  await ipfs.pin.add(fileAdded.cid);
  return fileHash;
};

const readData = async (path) => {
  return new Promise((resolve) => {
    doAsync(fs)
      .readFile(path)
      .then((data) => {
        resolve(data);
      });
  });
};

const deleteFile = async (filePath) => {
  fs.unlink(filePath, (deleteErr) => {
    if (deleteErr) {
      return deleteErr;
    }
  });
};

const notificattionToAllSubscriber = async (
  followers,
  description,
  image
) => {
  for (let i of followers) {
    let obj = {
      title: `New Bundle Alert!`,
      notificationType: "Bundle_Create",
      description: description,
      userId: i,
      image: image,
    };
    await createNotification(obj);
  }
};
