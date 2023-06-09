import { GetKR } from '../../apis/apiGET';
import filter from '../../assets/filter1.png';
import { todoDateInfo } from '../../store/store';
import { StKrFilter } from '../../styles/tododetail.styled';
import { useDropDown } from '../global/globaldropdown/dropdown';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { useRecoilState } from 'recoil';

const KrFilter = () => {
  const krDropRef = useRef(null);
  //드롭다운이 보여지는 상태관리
  const [krDropOn, setKrDropon] = useDropDown(krDropRef, false);
  const [info, setInfo] = useRecoilState(todoDateInfo);

  const [checkedList, setCheckedList] = useState([]);
  const [checkInfo, setCheckInfo] = useState([]);
  const [forData, setForData] = useState([]);
  // console.log(forData);

  const { data: getKrData } = useQuery(['KR'], GetKR, {
    refetchOnWindowFocus: false,
    onSuccess: response => {
      const none = [{ keyResultId: 0, color: '#9b9b9b' }];
      const addNone = [...response, ...none];
      setCheckInfo(addNone);

      setCheckedList(addNone);

      setForData(JSON.parse(localStorage.getItem('kr')));
    },
  });

  const thisDelete = item => {
    setCheckedList(checkedList.filter(el => el !== item));
    setForData(forData?.filter(el => el !== item.keyResultId));
    const filter = info.KeyResultIds.filter(el => el !== item.keyResultId);
    setInfo({
      ...info,
      KeyResultIds: filter,
    });
  };

  const removeAll = () => {
    setCheckedList([]);
    setForData([]);

    setInfo({ ...info, KeyResultIds: [] });
  };

  // filterContainer를 누르면 Drop이 보이는 함수
  const krDroponHandler = () => {
    setKrDropon(!krDropOn);
  };

  const onCheckedElement = (checked, item) => {
    if (checked) {
      setCheckedList([...checkedList, JSON.parse(item)]);

      setForData([...forData, JSON.parse(item).keyResultId]);
      setInfo({
        ...info,
        KeyResultIds: [...info.KeyResultIds, JSON.parse(item).keyResultId],
      });
    } else if (!checked) {
      const filter = checkedList.filter(el => JSON.stringify(el) !== item);
      setCheckedList(filter);

      setForData(forData?.filter(el => el !== JSON.parse(item).keyResultId));
      const filterArray = forData?.filter(
        el => el !== JSON.parse(item).keyResultId
      );

      setInfo({ ...info, KeyResultIds: filterArray });
    }
  };

  return (
    <StKrFilter ref={krDropRef}>
      <div className='filterContainer' onClick={krDroponHandler}>
        <img src={filter} alt='' />

        <div className='result'>
          <span className='resultSide'>
            KR : &nbsp;
            {checkedList.length === 0 ? '선택안함' : null}
            {checkedList.map(el => {
              if (el.keyResultId === 0) {
                return (
                  <span key={el.keyResultId} style={{ color: el.color }}>
                    None
                  </span>
                );
              }
              return (
                <span key={el.keyResultId} style={{ color: el.color }}>
                  KR{el.krNumber},&nbsp;
                </span>
              );
            })}
          </span>
        </div>
      </div>

      {krDropOn && (
        <div className='krDrop'>
          <div className='inputBox'>
            <div className='hashFlex'>
              {checkedList?.map((data, index) => (
                <div
                  id={data.keyResultId}
                  className='hash'
                  key={index}
                  style={{
                    backgroundColor: `${data.color}`,
                    border: `2px solid ${data.color}`,
                  }}>
                  {data.keyResultId === 0 ? (
                    <span>None</span>
                  ) : (
                    <span>KR{data.krNumber}</span>
                  )}
                  <GrClose onClick={() => thisDelete(data)} />
                </div>
              ))}
            </div>
            <AiFillCloseCircle className='closeBtn' onClick={removeAll} />
          </div>
          <ul>
            {checkInfo.map(data => (
              <li key={data.keyResultId}>
                <input
                  type='checkbox'
                  onChange={e =>
                    onCheckedElement(e.target.checked, e.target.value)
                  }
                  value={JSON.stringify(data)}
                  checked={forData.includes(data.keyResultId) ? true : false}
                />
                {data.keyResultId === 0 ? (
                  <>
                    <span className='none' style={{ color: `${data.color}` }}>
                      None
                    </span>
                    <span className='desc'>{data.keyResult}</span>
                  </>
                ) : (
                  <>
                    <span className='kr' style={{ color: `${data.color}` }}>
                      KR{data.krNumber} :
                    </span>
                    <span className='desc'>{data.keyResult}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </StKrFilter>
  );
};

export default KrFilter;
