import { Item } from '../types/types';
import { api } from './axios';

export const itemsApi = {
    getAllItems: (): Promise<Item[]> =>
        api.get('items',
            {headers: {'Access-Control-Allow-Origin': '*'}}

        )
};