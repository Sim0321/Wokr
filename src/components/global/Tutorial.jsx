import { PatchTutorial } from '../../apis/apiPATCH';
import tutorialImg from '../../assets/tutorial2.png';
import close from '../../assets/whiteClose.png';
import { showTutorial } from '../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const Tutorial = () => {
  const [haveCh, setHaveCh] = useState(false);

  const [showTutorialState, setShowTutorialState] =
    useRecoilState(showTutorial);

  const queryClient = useQueryClient();

  const { mutate: patchTutorial } = useMutation(PatchTutorial, {
    onSuccess: response => {
      queryClient.invalidateQueries(['userInfo']);
    },
  });

  const onClickTutorial = () => {
    if (showTutorial && !haveCh) {
      setShowTutorialState(!showTutorialState);
    } else if (showTutorial && haveCh) {
      setShowTutorialState(!showTutorialState);
      patchTutorial();
    }
  };
  return (
    <StTutorial>
      <img className='bg' src={tutorialImg} alt='tutorial' />
      <div className='checkBox'>
        {haveCh ? (
          <input
            type='checkbox'
            id='checkbox'
            onChange={e => setHaveCh(e.target.checked)}
          />
        ) : (
          <input
            type='checkbox'
            id='checkbox'
            onChange={e => setHaveCh(e.target.checked)}
          />
        )}

        <label htmlFor='checkbox'>다시보지 않기</label>
        {/* <div className='close' onClick={() => patchTutorial()} /> */}
        <div className='close' onClick={onClickTutorial} />
      </div>
    </StTutorial>
  );
};

export default Tutorial;

const StTutorial = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 20;

  .bg {
    width: 100%;
    height: 100%;
    /* background: url(${tutorialImg}) no-repeat left top / cover; */
  }
  .checkBox {
    width: 226px;
    line-height: 32px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 53px;
    right: 53px;
    z-index: 21;
    input {
      width: 26px;
      height: 26px;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
    label {
      font-size: 22px;
      color: #fff;
      margin: 0 29px 0 11px;
      cursor: pointer;
    }
    .close {
      width: 20px;
      height: 20px;
      background: url(${close}) no-repeat center / cover;
      cursor: pointer;
    }
  }
`;
