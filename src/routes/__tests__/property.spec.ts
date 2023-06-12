import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import seedData from '../../data/seed.json';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  describe('GET /properties', () => {
    it('should return a list of properties', async () => {
      const response = await request(app).get('/properties');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      // Check the pagination defaults
      expect(response.body.length).toEqual(10);
      expect(response.body?.[0].id).toEqual(1);
    });

    it('should return a list of properties filtered by address', async () => {
      const response = await request(app).get('/properties?address=Main St');
      expect(response.status).toBe(200);

      expect(response.body).toEqual(expect.any(Array));

      // No results
      expect(response.body.length).toEqual(0);
    });

    it('should return a list of properties filtered by address', async () => {
      const address = '22690';
      const response = await request(app).get(`/properties?address=${address}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toEqual(3);

      for (const property of response.body) {
        expect(property.address).toContain(address);
      }
    });

    it('should return a list of properties filtered by price range', async () => {
      const minPrice = 24925949;
      const maxPrice = 999999999999;
      const response = await request(app).get(
        `/properties?min_price=${minPrice}&max_price=${maxPrice}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toEqual(3);

      for (const property of response.body) {
        expect(property.price).toBeLessThanOrEqual(maxPrice);
        expect(property.price).toBeGreaterThanOrEqual(minPrice);
      }
    });

    it('should return a list of properties filtered by bedrooms and bathrooms', async () => {
      const bedrooms = 3;
      const bathrooms = 2;
      const response = await request(app).get(
        `/properties?bedrooms=${bedrooms}&bathrooms=${bathrooms}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toEqual(3);

      for (const property of response.body) {
        expect(property.bedrooms).toEqual(bedrooms);
        expect(property.bathrooms).toEqual(bathrooms);
      }
    });
  });

  it('should return a single property', async () => {
    const response = await request(app).get('/properties/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(seedData[0]);
  });

  it('should create a new property', async () => {
    const propertyData = {
      address: '123 Main St',
      price: 100000,
      bedrooms: 2,
      bathrooms: 1,
      type: 'SingleFamilyResidence',
    };

    const response = await request(app).post('/properties').send(propertyData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(propertyData));
  });

  it('should update an existing property', async () => {
    const propertyData = {
      address: '456 Elm St',
    };

    const seedProperty = seedData[2];

    const response = await request(app)
      .put(`/properties/${seedProperty.id}`)
      .send(propertyData);

    console.log(response.body.address, propertyData.address);
    expect(response.status).toBe(200);
    expect(response.body.address).toContain(propertyData.address);
    expect(response.body.bedrooms).toEqual(seedProperty.bedrooms);
    expect(response.body.id).toEqual(seedProperty.id);
    expect(response.body.bathrooms).toEqual(seedProperty.bathrooms);
    expect(response.body.type).toEqual(seedProperty.type);
    expect(response.body.price).toEqual(seedProperty.price);
  });

  it('should delete an existing property', async () => {
    const response = await request(app).delete('/properties/3');
    expect(response.status).toBe(204);
  });
});
