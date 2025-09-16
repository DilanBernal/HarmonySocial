import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../../../../config/AppConfig';
import ApiSerice, { ApiService as apiService } from '../../general/ApiService';
import UserBasicData from '../../../dtos/UserBasicData';

export default class UserService {
  private readonly baseUrl: string;
  private readonly apiService: apiService;

  constructor() {
    this.baseUrl = AppConfig.apiBaseUrl;
    this.apiService = ApiSerice;

    // Log de configuración para debugging
    console.log('AuthUserService initialized with:', {
      baseUrl: this.baseUrl,
    });
  }

  public async getUserData(id: number): Promise<UserBasicData | null> {
    try {
      const result = await this.apiService.get<UserBasicData>(
        `users/basic-info?id=${id}`,
      );
      console.log(result);
      if (result) {
        console.log(result);

        await AsyncStorage.setItem('userData', JSON.stringify(result));
        console.log(await AsyncStorage.getItem('userData'));
        return result;
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
