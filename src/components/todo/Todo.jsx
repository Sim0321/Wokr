import { GetKR } from '../../apis/apiGET';
import { krDataAtom, todoDateInfo } from '../../store/store';
import { DetailTodoWrap } from '../../styles/tododetail.styled';
import Toast from './../global/Toast';
import DetailTodoItem from './DetailTodoItem';
import TeamTodo from './TeamTodo';
import TodoNavi from './TodoNavi';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

export default function Todo() {
  const [info, setInfo] = useRecoilState(todoDateInfo);

  const setKrData = useSetRecoilState(krDataAtom);

  const { data: getKr } = useQuery(['KR'], GetKR, {
    onSuccess: response => {
      setKrData(response);
      // todo페이지에서 필요한 kr id
      const filterArray = response.map(el => el.keyResultId);
      filterArray.push(0);
      setInfo({ ...info, KeyResultIds: filterArray });
      localStorage.setItem('kr', JSON.stringify(filterArray));
    },
  });

  useEffect(() => {
    if (info.targetDate === '' || info.teamMembers.length === 0) {
      setInfo({
        ...info,
        targetDate: localStorage.getItem('today'),
        teamMembers: [JSON.parse(localStorage.getItem('userId'))],
      });
    }
  }, []);

  return (
    <StSticky>
      <TodoDashboard>
        <TodoNavi />

        <DetailTodoWrap>
          <DetailTodoItem />
        </DetailTodoWrap>
      </TodoDashboard>
      <TeamTodo />
      <Toast />
    </StSticky>
  );
}

const StSticky = styled.div`
  display: flex;
  .notHave {
    width: 100%;
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--main-color);
  }
`;

const TodoDashboard = styled.div`
  max-width: 1195px;
  width: 100%;
  position: relative;
`;
