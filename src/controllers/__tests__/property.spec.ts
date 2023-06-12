import * as controller from '../.';
import dataSource from '../../dataSource';
import { Property } from '../../entities';

// Mocking the dataSource and Property entity for testing
jest.mock('../../dataSource');
jest.mock('../../entities');

describe('Controller Tests', () => {
  // Mocking the repository and query builder
  const propertyRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(() => {
    // Clearing the mock function calls before each test
    jest.clearAllMocks();

    // Mocking the dataSource.getRepository to return the mocked repository
    (dataSource.getRepository as jest.Mock).mockReturnValue(propertyRepository);
  });

  describe('list', () => {
    it('should retrieve a list of properties based on input parameters', async () => {
      const input = {
        address: 'Example Address',
        bedrooms: '2',
        price: '100000',
        limit: '10',
        offset: '0',
      };

      await controller.list(input);

      expect(propertyRepository.createQueryBuilder).toHaveBeenCalledWith(
        'property',
      );
      expect(propertyRepository.andWhere).toHaveBeenCalledWith(
        'address like :address',
        {
          address: '%Example Address%',
        },
      );
      expect(propertyRepository.andWhere).toHaveBeenCalledWith(
        'bedrooms = :bedrooms',
        {
          bedrooms: '2',
        },
      );
      expect(propertyRepository.andWhere).toHaveBeenCalledWith(
        'price = :price',
        {
          price: '100000',
        },
      );
      expect(propertyRepository.take).toHaveBeenCalledWith(10);
      expect(propertyRepository.offset).toHaveBeenCalledWith(0);
      expect(propertyRepository.getMany).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should retrieve a property based on the provided ID', async () => {
      const input = { id: '1' };
      const mockedProperty = {
        id: 1,
        address: 'Example Address',
        price: 100000,
      };

      propertyRepository.findOne.mockResolvedValue(mockedProperty);

      const result = await controller.get(input);

      expect(propertyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(mockedProperty);
    });

    it('should return undefined if ID is not provided', async () => {
      const input = { id: '' };

      const result = await controller.get(input);

      expect(propertyRepository.findOne).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined if property is not found', async () => {
      const input = { id: '1' };

      propertyRepository.findOne.mockResolvedValue(undefined);

      const result = await controller.get(input);

      expect(propertyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('deleteOne', () => {
    it('should delete a property based on the provided ID', async () => {
      const input = { id: '1' };

      await controller.deleteOne(input);

      expect(propertyRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return undefined if ID is not provided', async () => {
      const input = { id: '' };

      const result = await controller.deleteOne(input);

      expect(propertyRepository.delete).not.toHaveBeenCalled();
      expect(result).toBe(undefined);
    });

    it('should return affected 0 if property is not found', async () => {
      const input = { id: '1' };

      propertyRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await controller.deleteOne(input);

      expect(propertyRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toStrictEqual({ affected: 0 });
    });
  });

  describe('create', () => {
    it('should create a new property with the provided input', async () => {
      const input = {
        address: 'Example Address',
        price: 100000,
        bedrooms: 2,
        bathrooms: 2,
        type: 'house',
      };
      const mockedProperty = { id: 1, ...input };

      propertyRepository.create.mockReturnValue(mockedProperty);
      propertyRepository.save.mockResolvedValue(mockedProperty);

      const result = await controller.create(input);

      expect(propertyRepository.create).toHaveBeenCalledWith(input);
      expect(propertyRepository.save).toHaveBeenCalledWith(mockedProperty);
      expect(result).toBe(mockedProperty);
    });
  });

  describe('update', () => {
    it('should update an existing property with the provided input', async () => {
      const updateId = '1';
      const input = {
        address: 'Updated Address',
        price: 150000,
      };
      const mockedProperty = {
        id: 1,
        address: 'Example Address',
        price: 100000,
      };

      propertyRepository.findOne.mockResolvedValue(mockedProperty);
      propertyRepository.merge.mockReturnValue(mockedProperty);
      propertyRepository.save.mockResolvedValue(mockedProperty);

      const result = await controller.update(updateId, input);

      expect(propertyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(propertyRepository.merge).toHaveBeenCalledWith(
        mockedProperty,
        input,
      );
      expect(propertyRepository.save).toHaveBeenCalledWith(mockedProperty);
      expect(result).toBe(mockedProperty);
    });

    it('should return undefined if updateId is not provided', async () => {
      const updateId = '';
      const input = {
        address: 'Updated Address',
        price: 150000,
      };

      const result = await controller.update(updateId, input);

      expect(propertyRepository.findOne).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined if property is not found', async () => {
      const updateId = '1';
      const input = {
        address: 'Updated Address',
        price: 150000,
      };

      propertyRepository.findOne.mockResolvedValue(undefined);

      const result = await controller.update(updateId, input);

      expect(propertyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeUndefined();
    });
  });
});
