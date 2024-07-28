const { Hashtag } = require("../models/index");

class HashtagRepository {
  static getInstance() {
    if (!HashtagRepository.instance) {
      HashtagRepository.instance = new HashtagRepository();
    }
    return HashtagRepository.instance;
  }

  async createHashtags(data) {
    const hashtags = Hashtag.insertMany(data);
    return hashtags;
  }

  async getHashtagById(id) {
    return Hashtag.findById(id);
  }

  async getHashtags() {
    return Hashtag.find();
  }

  async updateHashtag(id, hashtag) {
    return Hashtag.updateOne({ _id: id }, hashtag);
  }

  async deleteHashtag(id) {
    return Hashtag.deleteOne({ _id: id });
  }
}

module.exports = HashtagRepository;
