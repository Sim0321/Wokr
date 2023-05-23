import { GetMyTodo } from '../../../apis/apiGET';
import plus from '../../../assets/plus.png';
import TodoModal from '../../../components/global/globalModal/TodoModal';
import { todoListState } from '../../../store/store';
import { NotHaveEl } from '../../../styles/modal.styled';
import {
  Container,
  Header,
  HeaderBox,
  TodoContainer,
  StTodoItem,
} from '../../../styles/todo.styled';
import Potal from '../../global/globalModal/Potal';
import TodoItem from './TodoItem';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';

export default function DashTodo({ todayFormat }) {
  const [todoModalOn, setTodoModalOn] = useState(false);
  const onCloseTodoModal = () => {
    setTodoModalOn(!todoModalOn);
  };

  const createTodo = () => {
    setTodoModalOn(!todoModalOn);
  };

  const todoModalRef = useRef(null);
  const todoModalOutSideClick = e => {
    if (todoModalRef.current === e.target) {
      setTodoModalOn(!todoModalOn);
    }
  };

  const [todoList, setTodoList] = useRecoilState(todoListState);

  const { data: myTodo } = useQuery(['ToDo'], GetMyTodo, {
    onSuccess: response => {
      setTodoList(response);
    },
  });

  return (
    <Container>
      <HeaderBox>
        <Header>To-do</Header>
        <div className='btnBox'>
          <div onClick={createTodo}>
            <img src={plus} alt='plus' />
          </div>
        </div>
      </HeaderBox>

      <TodoContainer>
        {todoList?.completionTodo.length === 0 &&
        todoList?.progressTodo.length === 0 ? (
          <NotHaveEl>
            <h2>설정된 To Do 없습니다.</h2>
            <div className='btnFlex' onClick={createTodo}>
              <img src={plus} alt='plus' />
              <div>To Do추가</div>
            </div>
          </NotHaveEl>
        ) : (
          <StTodoItem>
            <TodoItem />
          </StTodoItem>
        )}
      </TodoContainer>

      <Potal>
        {todoModalOn && (
          <TodoModal
            onCloseTodoModal={onCloseTodoModal}
            todoModalRef={todoModalRef}
            todoModalOutSideClick={todoModalOutSideClick}
          />
        )}
      </Potal>
    </Container>
  );
}
