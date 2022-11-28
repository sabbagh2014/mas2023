const userModel = require("../../../models/user");
const status = require("../../../enums/status");
const userType = require("../../../enums/userType");
const mongoose = require("mongoose");

const userServices = {
  
  userCheck: async (userId) => {
    let query = {
      $and: [
        { status: { $ne: status.DELETE } },
        { $or: [{ email: userId }, { mobileNumber: userId }] },
      ],
    };
    return await userModel.findOne(query);
  },

  checkUserExists: async (mobileNumber, email) => {
    let query = {
      $and: [
        { status: { $ne: status.DELETE } },
        { $or: [{ email: email }, { mobileNumber: mobileNumber }] },
      ],
    };
    return await userModel.findOne(query);
  },

  emailMobileExist: async (mobileNumber, email, id) => {
    let query = {
      $and: [
        { status: { $ne: status.DELETE } },
        { _id: { $ne: id } },
        { $or: [{ email: email }, { mobileNumber: mobileNumber }] },
      ],
    };
    return await userModel.findOne(query);
  },

  checkSocialLogin: async (socialId, socialType) => {
    return await userModel.findOne({
      socialId: socialId,
      socialType: socialType,
    });
  },

  createUser: async (insertObj) => {
    return await userModel.create(insertObj);
  },

  findUser: async (query) => {
    return await userModel.findOne(query);
  },

  findUserWithSelect: async (query) => {
    return await userModel
      .findOne(query)
      .select("-ethAccount.privateKey -password -permissions -otp");
  },

  findUserData: async (query) => {
    return await userModel.findOne(query);
  },

  allUser: async (query) => {
    return await userModel.find(query);
  },  

  latestUserListWithPagination: async (search, page, limit, type) => {
    let query = { status: { $ne: status.DELETE } };
    if (type) {
      query.userType = type;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { "ethAccount.address": { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }
    var options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
      select:
        "-ethAccount.privateKey -password -email -referralCode -permissions -otp",
    };
    return await userModel.paginate(query, options);
  },

  allUsersList: async (validatedBody) => {
    const { type, search, page, limit } = validatedBody;
    let query = {
      status: status.ACTIVE,
      userType: { $in: [userType.USER, userType.CREATOR] },
    };
    if (type) {
      query.userType = type;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { "ethAccount.address": { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }
    var options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
      select:
        "-ethAccount.privateKey -password -email -permissions -otp",
    };
    return await userModel.paginate(query, options);
  },

  updateUser: async (query, updateObj) => {
    return await userModel
      .findByIdAndUpdate(query, updateObj, { new: true })
      .select("-ethAccount.privateKey -password -otp");
  },

  updateUserById: async (query, updateObj) => {
    return await userModel
      .findByIdAndUpdate(query, updateObj, { new: true })
      .select("-ethAccount.privateKey -password -otp");
  },

  insertManyUser: async (obj) => {
    return await userModel.insertMany(obj);
  },

  paginateSearch: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    let options = {
      page: page || 1,
      limit: limit || 15,
      sort: { createdAt: -1 },
      select:
        "-ethAccount.privateKey -password -referralCode -permissions -otp",
    };
    return await userModel.paginate(query, options);
  },

  followersList: async (followers) => {
    return userModel
      .find({ _id: { $in: followers }, status: { $ne: status.DELETE } })
      .select(
        "-ethAccount.privateKey -password -permissions -otp"
      );
  },

  followingList: async (following) => {
    return userModel
      .find({ _id: { $in: following }, status: { $ne: status.DELETE } })
      .select(
        "-ethAccount.privateKey -password -permissions -otp"
      );
  },

  userCount: async () => {
    return await userModel.countDocuments();
  },

  userList: async (validatedBody) => {
    let query = {
      status: { $ne: status.DELETE },
      userType: { $in: [userType.USER, userType.CREATOR] },
    };
    const { search, type, planType, fromDate, toDate, page, limit } =
      validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { "ethAccount.address": { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    if (type) {
      query.userType = type;
    }
    if (planType) {
      query.planType = planType;
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
      select:
        "-ethAccount.privateKey -password -referralCode -permissions -otp",
    };
    return await userModel.paginate(query, options);
  },

  adminModeratorList: async (validatedBody) => {
    let query = { userType: "Creator", status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
      select:
        "-ethAccount.privateKey -password -referralCode -email -permissions -otp",
    };
    return await userModel.paginate(query, options);
  },

  adminPaginationList: async (validatedBody) => {
    let query = { userType: "Admin", status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
      select:
        "-ethAccount.privateKey -password -referralCode -email -permissions -otp",
    };
    return await userModel.paginate(query, options);
  },

  userAllDetails: async (_id, userId) => {
    let query = {
      _id: mongoose.Types.ObjectId(_id),
      status: { $ne: status.DELETE },
    };
    if (userId) {
      return await userModel.aggregate([
        { $match: query },
        {
          $addFields: {
            isSubscribe: {
              $cond: {
                if: {
                  $in: [mongoose.Types.ObjectId(userId), "$followers"],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        // {
        //   $lookup: {
        //     from: "nft",
        //     localField: "_id",
        //     foreignField: "userId",
        //     as: "bundleDetails"
        //   },
        // },
        {
          $lookup: {
            from: "nft",
            as: "bundleDetails",
            let: {
              user_id: "$_id",
            },
            pipeline: [
              { $match: { $expr: { $eq: ["$$user_id", "$userId"] } } },
              { $sort: { createdAt: -1 } },
              {
                $lookup: {
                  from: "user",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userDetail",
                },
              },
              {
                $project: {
                  "userDetail.ethAccount.privateKey": 0,
                  "userDetail.password": 0,
                  "userDetail.referralCode": 0,
                  "userDetail.email": 0,
                  "userDetail.permissions": 0,
                },
              },
              {
                $unwind: "$userDetail",
              },
            ],
          },
        },
        {
          $lookup: {
            from: "audience",
            localField: "_id",
            foreignField: "userId",
            as: "postList",
          },
        },
        {
          $project: {
            "ethAccount.privateKey": 0,
            password: 0,
            referralCode: 0,
            email: 0,
            permissions: 0,
          },
        },
      ]);
    } else {
      return await userModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "nft",
            let: {
              user_id: "$_id",
            },
            pipeline: [
              // {
              //   $match: {
              //     $expr: { $eq: ["$$user_id", "$userId"] }
              //   },
              //   $sort: { createdAt: -1 }
              // },
              { $match: { $expr: { $eq: ["$$user_id", "$userId"] } } },
              { $sort: { createdAt: -1 } },
              {
                $lookup: {
                  from: "user",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userDetail",
                },
              },
              {
                $project: {
                  "userDetail.ethAccount.privateKey": 0,
                  "userDetail.password": 0,
                  "userDetail.email": 0,
                  "userDetail.referralCode": 0,
                  "userDetail.permissions": 0,
                },
              },
              {
                $unwind: "$userDetail",
              },
            ],
            as: "bundleDetails",
          },
        },
        {
          $lookup: {
            from: "audience",
            localField: "_id",
            foreignField: "userId",
            as: "postList",
          },
        },
        {
          $project: {
            "ethAccount.privateKey": 0,
            email: 0,
            password: 0,
            referralCode: 0,
            permissions: 0,
          },
        },
      ]);
    }
  },

  userAllDetailsByUserName: async (userName, userId) => {
    let query = { userName: userName, status: { $ne: status.DELETE } };
    if (userId) {
      return await userModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "nft",
            as: "bundleDetails",
            let: {
              user_id: "$_id",
            },
            pipeline: [
              { $match: { $expr: { $eq: ["$$user_id", "$userId"] } } },
              { $sort: { createdAt: -1 } },
              {
                $lookup: {
                  from: "user",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userDetail",
                },
              },
              {
                $project: {
                  "userDetail.ethAccount.privateKey": 0,
                  "userDetail.password": 0,
                  "userDetail.email": 0,
                  "userDetail.permissions": 0,
                },
              },
              {
                $unwind: "$userDetail",
              },
            ],
          },
        },
        {
          $project: {
            "ethAccount.privateKey": 0,
            email: 0,
            password: 0,
            permissions: 0,
          },
        },
      ]);
    } else {
      return await userModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "nft",
            as: "bundleDetails",
            let: {
              user_id: "$_id",
            },
            pipeline: [
              { $match: { $expr: { $eq: ["$$user_id", "$userId"] } } },
              { $sort: { createdAt: -1 } },
              {
                $lookup: {
                  from: "user",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userDetail",
                },
              },
              {
                $project: {
                  "userDetail.ethAccount.privateKey": 0,
                  "userDetail.password": 0,
                  "userDetail.email": 0,
                  "userDetail.permissions": 0,
                },
              },
              {
                $unwind: "$userDetail",
              },
            ],
          },
        },
        {
          $project: {
            "ethAccount.privateKey": 0,
            email: 0,
            password: 0,
            referralCode: 0,
            permissions: 0,
          },
        },
      ]);
    }
  },

  multiUpdateForUser: async (updateObj) => {
    return await userModel.updateMany({}, updateObj, { multi: true });
  },

  userAllDetailsWithBundleCount: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { "ethAccount.address": { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { planType: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
      select: "-ethAccount.privateKey -permissions -password -referralCode",
    };
    let aggregate = userModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "nft",
          localField: "_id",
          foreignField: "userId",
          as: "bundleDetails",
        },
      },
      { $addFields: { bundleCount: { $size: "$bundleDetails" } } },
      {
        $project: {
          "ethAccount.privateKey": 0,
          bundleDetails: 0,
          otpVerification: 0,
          isUpdated: 0,
          subscriberCount: 0,
          subscribeNft: 0,
          likesNft: 0,
          likesFeed: 0,
          permissions: 0,
          blockStatus: 0,
          likesAuctionNft: 0,
          password: 0,
          referralCode: 0,
          __v: 0,
        },
      },
    ]);
    return await userModel.aggregatePaginate(aggregate, options);
  },

  listSubAdmin: async (validatedBody) => {
    const { search, page, limit } = validatedBody;
    var query = {
      status: { $ne: status.DELETE },
      userType: userType.SUB_ADMIN,
    };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
    };

    return await userModel.paginate(query, options);
  },

  usersFundAggregate: async (aggregate) => {
    return await userModel.aggregate(aggregate);
  },
};

module.exports = { userServices };
