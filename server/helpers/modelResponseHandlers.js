class ResponseHandler {
  constructor(data, res) {
    (this.data = data), (this.res = res);
  }

  postResponse() {
    if (this.data == undefined)
      return this.res.status(500).json({ error: "Server side error" });

    return this.res.status(201).json({ msg: "Created" });
  }

  getResponse() {
    if (this.data == undefined)
      return this.res.status(500).json({ error: "Server side error" });
    if (this.data == null)
      return this.res.status(400).json({ err: "Request not found" });

    return this.res.status(200).json({ msg: "Success", data: this.data });
  }

  updateResponse() {
    if (this.data == undefined)
      return this.res.status(500).json({ error: "Server side error" });
    if (this.data == null)
      return this.res.status(400).json({ err: "Request not found" });

    return this.res.status(200).json({ msg: "Success", data: this.data });
  }

   deleteResponse() {
    if (this.data == undefined)
      return this.res.status(500).json({ error: "Server side error" });
    if (this.data == null)
      return this.res.status(400).json({ err: "Request not found" });

    return this.res.status(200).json({ msg: "Success", data: this.data });
  }
}

module.exports = ResponseHandler
