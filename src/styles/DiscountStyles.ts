import styled from "styled-components";

export const DiscountContainer = styled.div`
  width: 100%;
  background-color: #f9f9f1;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DiscountContent = styled.div`
  width: 80%;
  max-width: 1200px;
`;

export const DiscountTitle = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #000;
`;

export const DiscountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
`;

export const DiscountItem = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const DiscountTextBox = styled.div`
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  padding: 25px;
  grid-column: 1;
  grid-row: span 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const DiscountImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

export const DiscountInfo = styled.div`
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const DiscountName = styled.h3<{ $isRed?: boolean }>`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${(props) => (props.$isRed ? "#e74c3c" : "#333")};
`;

export const DiscountDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
  line-height: 1.5;
`; 