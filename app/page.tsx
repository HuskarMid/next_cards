'use client'

import styled from "styled-components";

const HomeUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

const HomeLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  width: 560px;
  margin-top: 5px;
  
  &::before {
    content: '✓';
    margin-right: 10px;
    color: green;
  }
  
  & p {
    font-size: 18px;
  }
`;

export default function Home() {
  return (
    <div>
      <h1 style={{marginTop: '12px'}}>Тестовое для Экосистемы Альфа</h1>
      <HomeUl>
        <HomeLi><p>В начале данные берутся из Api. Далее state синхронизируется с localStorage</p></HomeLi>
        <HomeLi><p>Кастомный хук useProducts для подгрузки/диспатча данных из компонентов</p></HomeLi>
        <HomeLi><p>Список продуктов, фильтрация по избранным, поиск, удаление, пагинация</p></HomeLi>
        <HomeLi><p>Страница create, 12 фото подгружаются из Api</p></HomeLi>
        <HomeLi><p>[id] страница продукта, [id] редактирование</p></HomeLi>
      </HomeUl>
    </div>
  );
}
