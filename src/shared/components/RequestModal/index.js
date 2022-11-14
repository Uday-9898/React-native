import React, {useState, useEffect, useContext} from 'react';
import {Text, View, Image} from 'react-native';
import {ModalComponent} from '../index';
import {GlobalContext} from '../../../utils/context/GlobalContext';
import {styles} from './styles';

import success_img from '../../../assets/images/ModalsImages/success.png';
import error_img from '../../../assets/images/ModalsImages/error.png';

const RequestModal = ({}) => {
  const [stateGlobal, setStateGlobal] = useContext(GlobalContext);
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    modalImage: success_img,
  });

  useEffect(() => {
    if (stateGlobal.requestModal.isVisible) {
      setTimeout(() => inTimeOut(), 3000);
      fillModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateGlobal.requestModal]);

  const inTimeOut = () => {
    setStateGlobal(state => ({
      ...state,
      requestModal: {
        isVisible: false,
        isSuccess: true,
        textModal: '',
      },
    }));
  };

  const fillModal = () => {
    if (!stateGlobal.requestModal.isSuccess) {
      if(stateGlobal.requestModal.textModal && stateGlobal.requestModal.textModal.includes('restricted period')){
        setTimeout(() => {
          setModalData({
            title: 'Warning',
            message: stateGlobal.requestModal.textModal,
            modalImage: error_img,
          });
        }, 100);
      }else{
        setTimeout(() => {
          setModalData({
            title: 'Error',
            message: stateGlobal.requestModal.textModal,
            modalImage: error_img,
          });
        }, 100);
      }
    } else {
      setTimeout(() => {
        setModalData({
          title: 'Success!',
          message: stateGlobal.requestModal.textModal,
          modalImage: success_img,
        });
      }, 100);
    }
  };

  return (
    <ModalComponent
      isModalVisible={stateGlobal.requestModal.isVisible}
      onlyComponent={true}>
      <View style={styles.modalContainer}>
        <Text style={styles.titleModal}>{modalData.title}</Text>
        <Image style={styles.imageStyle} source={modalData.modalImage} />
        <Text style={styles.messageModal}>{modalData.message}</Text>
      </View>
    </ModalComponent>
  );
};

export default RequestModal;
