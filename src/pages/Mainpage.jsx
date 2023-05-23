import { GetKR, GetUserInfo } from '../apis/apiGET';
import DashBoardCalendar from '../components/dashboard/calendar/Calendar';
import DashTodo from '../components/dashboard/dashTodo/DashToDo';
import DashOKR from '../components/dashboard/okr/DashOKR';
import Loading from '../components/global/Loading';
import Tutorial from '../components/global/Tutorial';
import Portal from '../components/global/globalModal/Potal';
import {
  krDataAtom,
  showTutorial,
  todayFormat,
  todoDateInfo,
  userDetail,
  userId,
} from '../store/store';
import {
  OkrContainer,
  StWrap,
  StWrapBackground,
} from '../styles/mainpage.styled';
import { useQuery } from '@tanstack/react-query';
import jwt_decode from 'jsonwebtoken/decode';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

export default function Mainpage() {
  const navigate = useNavigate();

  //  accesstoken 디코딩
  const [userInfo, setUserInfo] = useRecoilState(userDetail);

  // 튜토리얼
  const [showTutorialState, setShowTutorialState] =
    useRecoilState(showTutorial);

  const [info, setInfo] = useRecoilState(todoDateInfo);
  const setToday = useSetRecoilState(todayFormat);

  // 유저 id 상태관리
  const setUid = useSetRecoilState(userId);

  const [decodeId, setDecodeId] = useState(0);

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accesstoken')
  );

  useEffect(() => {
    if (localStorage.getItem('accesstoken')) {
      const decodeToken = jwt_decode(accessToken);
      const extractedUid = decodeToken.userId;
      setDecodeId(extractedUid);
    } else {
      navigate('/signin');
    }
  }, [accessToken]);

  //userInfo
  const { userinfo, isLoading } = useQuery(
    ['userInfo'],
    () => GetUserInfo(decodeId),
    {
      enabled: !!decodeId,
      onSuccess: data => {
        setShowTutorialState(data.firstLogin);
        setUserInfo(data);
        localStorage.setItem('userId', data.userId);
        setInfo({ ...info, teamMembers: [data.userId] });
        setUid(data.userId);
      },
    }
  );

  const now = new Date();
  useEffect(() => {
    let today = '';
    if (now.getMonth() + 1 < 10 && now.getDate() < 10) {
      today = `${now.getFullYear()}-0${now.getMonth() + 1}-0${now.getDate()}`;
      // localStorage.setItem('targetDate', today);
      setToday(today);
      localStorage.setItem('today', today);
      setInfo({ ...info, targetDate: today });
    } else if (now.getDate() < 10) {
      today = `${now.getFullYear()}-${now.getMonth() + 1}-0${now.getDate()}`;
      setToday(today);
      localStorage.setItem('today', today);
      setInfo({ ...info, targetDate: today });
    } else if (now.getMonth() + 1 < 10) {
      today = `${now.getFullYear()}-0${now.getMonth() + 1}-${now.getDate()}`;
      setToday(today);
      localStorage.setItem('today', today);
      setInfo({ ...info, targetDate: today });
    } else {
      today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      setToday(today);
      localStorage.setItem('today', today);
      setInfo({ ...info, targetDate: today });
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <StWrapBackground>
      <StWrap>
        {showTutorialState ? (
          <Portal>
            <Tutorial />
          </Portal>
        ) : (
          <main>
            <OkrContainer>
              <DashOKR />
              <DashTodo />
            </OkrContainer>
            <DashBoardCalendar />
          </main>
        )}
      </StWrap>
    </StWrapBackground>
  );
}
