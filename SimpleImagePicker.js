import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native';
import { STYLES, COLORS } from './Styles';
import { launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { RNS3 } from 'react-native-s3-upload';

export default function SimpleImagePicker() {
    const [imageSource, setImageSource] = useState(null);
    let uri, name, type;

    function selectImage() {
        let ImgPickerOptions = {
            mediaType: 'photo'
        };

        launchImageLibrary(ImgPickerOptions, response => {
            uri = response.uri;
            name = response.fileName;
            type = response.type;
            console.log({ response });
            console.log(uri);
            uploadImage();
        });
    }

    function uploadImage() {
        const file = {
            uri: uri,
            name: name,
            type: type
        }
        console.log(file);
        
        const S3options = {
            keyPrefix: "uploads/",
            bucket: "kids-bowling",
            region: "ap-northeast-1",
            // AWSがうるさい
            accessKey: "",
            secretKey: "",
            successActionStatus: 201
        }
        
        RNS3.put(file, S3options).then(response => {
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            console.log(response.body);
            /**
             * {
             *   postResponse: {
             *     bucket: "your-bucket",
             *     etag : "9f620878e06d28774406017480a59fd4",
             *     key: "uploads/image.png",
             *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
             *   }
             * }
             */
        });
    }
    
  
  return (
    <View
      style={[
        STYLES.flex,
        STYLES.centerContainer,
        { backgroundColor: COLORS.primaryDark }
      ]}
    >
      <Text style={[STYLES.title, { color: COLORS.primaryLight }]}>
        S3 イメージアップローダー
      </Text>
      <TouchableOpacity
        onPress={selectImage}
        style={[
          STYLES.selectButtonContainer,
          { backgroundColor: COLORS.primaryLight }
        ]}
      >
        <Text style={STYLES.selectButtonTitle}>イメージ選択</Text>
      </TouchableOpacity>
    </View>
  );
}
