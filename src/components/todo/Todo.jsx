import { DetailTodoWrap } from '../../styles/tododetail.styled';
import Toast from './../global/Toast';
import DetailTodoItem from './DetailTodoItem';
import TeamTodo from './TeamTodo';
import TodoNavi from './TodoNavi';
import styled from 'styled-components';

export default function Todo() {
  //todo 전부 가져오기

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
