import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';

const getPhotosDir = (): string => {
  return `${FileSystem.documentDirectory}photos/`;
};

// Ensure photos directory exists
export const ensurePhotosDirectory = async (): Promise<void> => {
  const photosDir = getPhotosDir();
  const dirInfo = await FileSystem.getInfoAsync(photosDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
  }
};

// Request camera permissions
export const requestCameraPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permissão Necessária',
      'Precisamos de permissão para acessar sua câmera.'
    );
    return false;
  }
  return true;
};

// Request photo library permissions
export const requestLibraryPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permissão Necessária',
      'Precisamos de permissão para acessar suas fotos.'
    );
    return false;
  }
  return true;
};

// Compress and save photo
export const compressAndSavePhoto = async (uri: string): Promise<string> => {
  try {
    await ensurePhotosDirectory();

    // Compress image to max 800px width, 80% quality
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Generate unique filename
    const filename = `photo_${Date.now()}.jpg`;
    const photosDir = getPhotosDir();
    const destination = `${photosDir}${filename}`;

    // Move compressed image to permanent storage
    await FileSystem.moveAsync({
      from: manipResult.uri,
      to: destination,
    });

    return destination;
  } catch (error) {
    console.error('Error compressing photo:', error);
    throw error;
  }
};

// Take photo with camera
export const takePhoto = async (): Promise<string | null> => {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return await compressAndSavePhoto(result.assets[0].uri);
};

// Pick photo from library
export const pickPhoto = async (): Promise<string | null> => {
  const hasPermission = await requestLibraryPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return await compressAndSavePhoto(result.assets[0].uri);
};

// Show photo source selection
export const selectPhotoSource = (): Promise<'camera' | 'library' | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Adicionar Foto',
      'Escolha a origem da foto:',
      [
        {
          text: 'Câmera',
          onPress: () => resolve('camera'),
        },
        {
          text: 'Galeria',
          onPress: () => resolve('library'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
};
