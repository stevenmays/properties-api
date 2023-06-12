import dataSource from '../dataSource';
import { Property } from '../entities';
import { CustomError } from '../lib/custom-error';

export interface ListPropertiesInput {
  id: string;
  address: string;
  price: string;
  min_price: string;
  max_price: string;
  bedrooms: string;
  min_bedrooms: string;
  max_bedrooms: string;
  bathrooms: string;
  min_bathrooms: string;
  max_bathrooms: string;
  type: string;
  limit: string;
  offset: string;
}

/**
 * Lists
 */
export function list(input: Partial<ListPropertiesInput>) {
  const {
    id,
    address,
    bedrooms,
    min_bedrooms,
    max_bedrooms,
    price,
    min_price,
    max_price,
    bathrooms,
    min_bathrooms,
    max_bathrooms,
    type,
  } = input;

  const propertyRepository = dataSource.getRepository(Property);
  const queryBuilder = propertyRepository.createQueryBuilder('property');

  if (id) {
    queryBuilder.andWhere('id = :id', { id });
  }

  if (address) {
    queryBuilder.andWhere('address like :address', {
      address: `%${address}%`,
    });
  }

  if (bedrooms) {
    queryBuilder.andWhere('bedrooms = :bedrooms', { bedrooms });
  }

  if (min_bedrooms) {
    queryBuilder.andWhere('bedrooms >= :min_bedrooms', {
      bedrooms: min_bedrooms,
    });
  }

  if (max_bedrooms) {
    queryBuilder.andWhere('bedrooms <= :max_bedrooms', {
      bedrooms: min_bedrooms,
    });
  }

  if (bathrooms) {
    queryBuilder.andWhere('bathrooms = :bathrooms', { bathrooms });
  }

  if (min_bathrooms) {
    queryBuilder.andWhere('bathrooms >= :min_bathrooms', {
      bathrooms: min_bathrooms,
    });
  }

  if (max_bathrooms) {
    queryBuilder.andWhere('bathrooms <= :max_bathrooms', {
      bathrooms: max_bathrooms,
    });
  }

  if (price) {
    queryBuilder.andWhere('price = :price', { price });
  }

  if (min_price) {
    queryBuilder.andWhere('price >= :min_price', { min_price: min_price });
  }

  if (max_price) {
    queryBuilder.andWhere('price <= :max_price', { max_price: max_price });
  }

  if (type) {
    queryBuilder.andWhere('type = :type', { type });
  }

  try {
    const limit = input.limit ? parseInt(input.limit, 10) : 10;
    queryBuilder.take(limit);
  } catch {
    console.warn('unable to parse limit "%s"', input.limit);
    // Swallow this error, since we have defaults
  }

  try {
    const offset = input.offset ? parseInt(input.offset, 10) : 0;
    queryBuilder.offset(offset);
  } catch {
    console.warn('unable to parse offset "%s"', input.offset);
    // Swallow this error, since we have defaults
  }

  return queryBuilder.getMany();
}

export function get(input: { id: string }) {
  if (!input.id) {
    return;
  }

  let id;
  try {
    id = parseInt(input.id, 10);
  } catch {
    // swallow if parseInt fails
  }

  // id is always an integer. We might as well save a database call, and return not found
  if (!id) {
    return;
  }

  const propertyRepository = dataSource.getRepository(Property);
  return propertyRepository.findOne({ where: { id } });
}

export function deleteOne(input: { id: string }) {
  if (!input.id) {
    return;
  }

  let id;
  try {
    id = parseInt(input.id, 10);
  } catch {
    // swallow if parseInt fails
  }

  // id is always an integer. We might as well save a database call, and return not found
  if (!id) {
    return;
  }

  const propertyRepository = dataSource.getRepository(Property);
  return propertyRepository.delete(id);
}

export interface CreatePropertyInput {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string | null;
}

export function create(input: CreatePropertyInput) {
  const propertyRepository = dataSource.getRepository(Property);
  const property = propertyRepository.create(input);

  return propertyRepository.save(property);
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export async function update(updateId: string, input: UpdatePropertyInput) {
  if (!updateId) {
    return;
  }

  const id = parseInt(updateId, 10);

  const propertyRepository = dataSource.getRepository(Property);

  const property = await propertyRepository.findOne({ where: { id } });

  if (!property) {
    return;
  }

  propertyRepository.merge(property, input);
  return propertyRepository.save(property);
}
