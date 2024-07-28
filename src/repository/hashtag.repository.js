const { Hashtag } = require("../models/index");

class HashtagRepository {
  static getInstance() {
    if (!HashtagRepository.instance) {
      HashtagRepository.instance = new HashtagRepository();
    }
    return HashtagRepository.instance;
  }

  async createHashtags(data) {
    console.log(data);
    const hashtags = await Hashtag.insertMany(data);
    return hashtags;
  }

  async getHashtagById(id) {
    return Hashtag.findById(id);
  }

  async getHashtags(data) {
    return await Hashtag.find({
      name: { $in: data },
    });
  }

  async updateHashTags(ids, data) {
    const hashtags = await Hashtag.updateMany(
      {
        _id: { $in: ids },
      },
      {
        $push: { tweets: data.tweet },
      },
      { new: true }
    );
    return hashtags;
  }
}

module.exports = HashtagRepository;
