class MovieTicket {
    // Constructor khởi tạo đối tượng
    constructor(ticketId, movie, cinema, seat, date, time, buyerName, buyerEmail, price) {
      this._ticketId = ticketId;
      this._movie = movie;
      this._cinema = cinema;
      this._seat = seat;
      this._date = date;
      this._time = time;
      this._buyerName = buyerName;
      this._buyerEmail = buyerEmail;
      this._price = price;
    }
  
    // Getter cho ticketId
    get ticketId() {
      return this._ticketId;
    }
  
    // Setter cho ticketId
    set ticketId(value) {
      if (!value) throw new Error("Ticket ID cannot be empty");
      this._ticketId = value;
    }
  
    // Getter cho thông tin vé (dạng object)
    getTicketInfo() {
      return {
        ticketId: this._ticketId,
        movie: this._movie,
        cinema: this._cinema,
        seat: this._seat,
        date: this._date,
        time: this._time,
        buyer: {
          name: this._buyerName,
          email: this._buyerEmail,
        },
        price: this._price,
      };
    }
  
    // Chuyển đối tượng thành JSON
    toJSON() {
      return JSON.stringify(this.getTicketInfo(), null, 2);
    }
  
    // Tạo đối tượng từ JSON
    static fromJSON(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        return new MovieTicket(
          data.ticketId,
          data.movie,
          data.cinema,
          data.seat,
          data.date,
          data.time,
          data.buyer.name,
          data.buyer.email,
          data.price
        );
      } catch (error) {
        throw new Error("Invalid JSON format");
      }
    }
  }
  