export class Product {
  private _id?: string;
  private _title?: string;
  private _description?: string;
  private _image?: string;
  private _price?: number;
  private _count?: number;

  constructor({ id, title, description, image, price, count }) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._image = image;
    this._price = price;
    this._count = count;
  }

  getId() {
    return this._id;
  }

  getTitle() {
    return this._title;
  }

  getDescription() {
    return this._description;
  }

  getImage() {
    return this._image;
  }

  getPrice() {
    return this._price;
  }

  getCount() {
    return this._count;
  }
}
