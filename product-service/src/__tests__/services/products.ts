import { isValidProduct } from '../../services';

describe('isValidProduct function', function () {
  let productMock = {};

  beforeAll(() => {
    productMock = {
      count: 2,
      price: 200,
      title: 'Product Title',
      description: 'This product',
      image: 'http://someurl',
    };
  });

  it('should return true when product is valid', async () => {
    const result = isValidProduct(productMock);

    expect(result).toBe(true);
  });

  it('should return false when product is empty', async () => {
    const result = isValidProduct({});

    expect(result).toBe(false);
  });

  describe('validate product.title', () => {
    it('should return false when product.title is empty', async () => {
      (productMock as any).title = '';
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });

    it('should return false when product.title is not a string', async () => {
      (productMock as any).title = 2323;
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });
  });

  describe('validate product.description', () => {
    it('should return false when product.description is empty', async () => {
      (productMock as any).description = '';
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });

    it('should return false when product.description is not a string', async () => {
      (productMock as any).description = 2323;
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });
  });
  describe('validate product.image', () => {
    it('should return false when product.image is empty', async () => {
      (productMock as any).image = '';
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });

    it('should return false when product.image is not a string', async () => {
      (productMock as any).image = 2323;
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });
  });
  describe('validate product.price', () => {
    it('should return false when product.price is empty', async () => {
      (productMock as any).price = '';
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });

    it('should return false when product.price is not a integer', async () => {
      (productMock as any).price = '2322';
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });
    it('should return false when product.price less than zero', async () => {
      (productMock as any).price = -5;
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });
  });
  describe('validate product.count', () => {
    it('should return false when product.count is empty', async () => {
      (productMock as any).count = '';
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });

    it('should return false when product.count is not a integer', async () => {
      (productMock as any).count = '2323';
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });
    it('should return false when product.count less than zero', async () => {
      (productMock as any).count = -6;
      const result = isValidProduct(productMock);

      expect(result).toBe(false);
    });
  });
});
