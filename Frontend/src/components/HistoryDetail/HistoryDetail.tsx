import React,{useState,useEffect} from 'react';
import {Avatar,ListItemPrefix,Typography,Button,Input} from '@material-tailwind/react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ToggleButton from '@mui/material/ToggleButton';
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import Swal from 'sweetalert2';
import { useUserStore } from 'store/UserStore';
import { useParams } from 'react-router-dom';
import { response } from 'express';


const HistoryDetail = () => {
    // const { transactionId } = useParams<{ transactionId: string }>();
    const [analys, setAnalys] = useState(false)
    const [receiptImage, setReceiptImage] = useState<File | null>(null);
    const [originalItem, setOriginalItem] = useState<{ name: string; price: string }>({ name: '', price: '' });
    const [addItem,setAddItem] = useState(false)
    const [newItemName,setNewItemName] = useState('')
    const [newItemPrice,setNewItemPrice] = useState('')
    const { accessToken, refreshToken} = useUserStore();
    const [imgRegister,setImgRegister] = useState(false)

    const [clovaAnalys, setClovaAnalys] = useState({
        items: [
          {
            name: '영화관',
            price: '3000',
          },
          {
            name: '콘칩',
            price: '3000',
          },
          {
            name: '허니버터',
            price: '3000',
          },
        ],
      });
    const [canalys,setcAnalys]= useState([])
    
  
    const [editableItemIndex, setEditableItemIndex] = useState<number | null>(null);
      
    // const postOCR=()=>{
    //     const formData = new FormData();
    //     if (receiptImage) {
    //         formData.append('img', receiptImage);
    //         axios
    //         .post('https://j9c211.p.ssafy.io/api/analyst-management/analysts/receipt',formData,
    //         {
    //             headers: {
    //                 'ACCESS-TOKEN': accessToken,
    //                 'REFRESH-TOKEN': refreshToken,
    //               } 
    //         })
    //         .then((response)=>{
    //             console.log(response.data)
    //             setImgRegister(true)
    //             setcAnalys(response.data.response.list)
    //             console.log(canalys)
    //         })
    //         .catch((error)=>{
    //             console.log(formData)
    //         })
    //     }
    // }
    const getOCR=()=>{
        axios.get('https://j9c211.p.ssafy.io/api/analyst-management/analysts/receipt/test',
        {
            headers: {
                'ACCESS-TOKEN': accessToken,
                'REFRESH-TOKEN': refreshToken,
                } 
        })
        .then((response)=>{
            // console.log(response.data.response.list)
            setClovaAnalys(response.data.response.list)
            console.log(clovaAnalys)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        // postOCR()
        getOCR()
    },[])

    const handleEdit = (index: number) => {
        setEditableItemIndex(index);
        setOriginalItem(clovaAnalys.items[index]);
      };
  
    const handleSave = (index: number) => {
        const editedItem = clovaAnalys.items[index];

        if (editedItem.name === '' || editedItem.price === '') {
            Swal.fire({
              icon: 'warning',
              title: '값을 올바르게 입력해주세요',
            });
            return; 
          }
        setEditableItemIndex(null);
        console.log(clovaAnalys);
        
      
        // 변경 사항을 실제 데이터에 적용합니다.
        // 이전 항목을 가져와서 변경 사항을 적용한 다음, 새로운 배열을 만들어 clovaAnalys에 설정합니다.
        setClovaAnalys((prevState) => ({
          ...prevState,
          items: prevState.items.map((item, i) =>
            i === index ? { ...originalItem, ...item } : item
          ),
        }));
      };
    
    const handleOpenAddItem = () => {
        setAddItem(!addItem)
        setNewItemPrice('')
        setNewItemName('')
    }
    
    const handleDelete = (index: number) => {
        // 해당 인덱스의 항목을 제거한 새 배열 생성
        const newItems = [...clovaAnalys.items];
        newItems.splice(index, 1);
    
        // clovaAnalys 상태를 업데이트하여 해당 항목을 삭제
        setClovaAnalys((prevState) => ({
          ...prevState,
          items: newItems,
        }));
      };
      const handleItemInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string, index: number) => {
        const { value } = event.target;
      
        // 현재 항목을 복제하고 변경 사항을 적용한 후에 상태에 저장합니다.
        setClovaAnalys((prevState) => ({
          ...prevState,
          items: prevState.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
          ),
        }));
      };
    
    const handleCancel = (index: number) => {
    // 이전 값으로 해당 항목을 복원합니다.
    setClovaAnalys((prevState) => ({
        ...prevState,
        items: prevState.items.map((item, i) =>
        i === index ? { ...originalItem } : item
        ),
    }));
    
    // 편집 모드 종료
    setEditableItemIndex(null);
    };
    const handleAddItem = (name: string, price: string) => {
        // 새로운 항목 생성
        if (name===''){
            Swal.fire({
                icon: 'warning',
                title: '상세 품목이름을 입력해주세요',
              })}
        else if(price === ''){
            Swal.fire({
                icon: 'warning',
                title: '물건의 가격을 입력해주세요',
              }); 
        }
        else{
        const newItem = { name, price };
      
        // 새로운 항목을 현재 항목 목록에 추가한 후, 편집 모드로 설정
        setClovaAnalys((prevState) => ({
          ...prevState,
          items: [...prevState.items, newItem],
        }));
      
        // 추가 모드 종료
        setAddItem(false);
        }
      };
    
    const registerItem = () =>{
        const total = clovaAnalys.items.reduce((acc, item) => acc + Number(item.price), 0);

        if (total !== 10000) {
          Swal.fire({
            icon: 'warning',
            title: '가격 합계가 일치하지 않습니다',
          });
          return;
        }
    }
    return (
        <div className='flex flex-col items-center mt-3 '>
                {imgRegister? 
                <div className='w-[86%] flex flex-col items-center'>
                    <div className='w-full  flex justify-end'>
                        <button onClick={handleOpenAddItem}><AddCircleIcon  color='primary' fontSize='large'/></button>
                    </div>
                    {addItem? (
                        <div className='w-full flex justify-between items-center mt-2'>
                            <input 
                            type="text" 
                            className='w-[90px] h-[40px] font-main text-center rounded-lg'
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}/>
                            <input 
                            type="number"
                            className='w-[90px] h-[40px] font-main text-center rounded-lg' 
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}/>
                            <div>
                            <button onClick={() => handleAddItem(newItemName, newItemPrice)}>
                                <DoneIcon color='success' fontSize='medium' />
                            </button>
                            <button onClick={handleOpenAddItem}>
                                <ClearIcon color='error' fontSize='medium' />
                            </button>
                            </div>
                        </div>
                    ):
                    null
                   }
                    {clovaAnalys.items.map((item, index) => (
                        <div key={index} className='w-full flex justify-between items-center mt-2'>
                        <input
                            value={item.name}
                            className='w-[90px] h-[40px] font-main text-center rounded-lg'
                            disabled={editableItemIndex !== index}
                            onChange={(e) => handleItemInputChange(e, 'name', index)}
                        />
                        <input
                            type='number'
                            value={item.price}
                            className='w-[90px] h-[40px] font-main text-center rounded-lg '
                            disabled={ editableItemIndex !== index}
                            onChange={(e) => handleItemInputChange(e, 'price', index)}
                        />
                        {editableItemIndex === index ? (
                            <div>
                            <button onClick={() => handleSave(index)}>
                                <DoneIcon color='success' fontSize='medium' />
                            </button>
                            <button onClick={() => handleCancel(index)}>
                                <ClearIcon color='error' fontSize='medium' />
                            </button>
                            </div>
                        ) : (
                            <div>
                            <button onClick={() => handleEdit(index)}>
                                <EditIcon color='primary' fontSize='small' />
                            </button>
                            <button onClick={() => handleDelete(index)}>
                                <DeleteIcon color='error' fontSize='small' />
                            </button>
                            </div>
                        )}
                        </div>
                    ))}   
                    <div className='border-blue-gray-100 rounded-xl border mt-5 w-full'>
                            <Typography variant="h3" color="black" className='mx-3 my-2' >
                            분석 결과가 맞나요?
                            </Typography>
                            <Typography variant="h6" color="black" className='mx-3 my-1' >
                            촬영한 영수증이 자동 분석되었습니다.
                            </Typography>
                            <Typography variant="h6" color="black" className='mx-3 my-1'>
                            정보가 정확하게 분석되었나요?
                            </Typography>
                            <div className='w-full flex justify-center gap-4 my-4'>
                                <Button variant='gradient' color='blue' onClick={registerItem}>
                                    <span>네 정확해요</span>
                                </Button>
                                <Button variant='gradient' color='gray'onClick={() => document.getElementById('file-input')?.click()}>
                                    <span>아니요 다시찍을래요</span>
                                    <input
                                        type="file"
                                        id="file-input"
                                        accept="image/*"
                                        style={{
                                            position: 'absolute',
                                            opacity: 0,
                                            width: 0,
                                            height: 0,
                                            overflow: 'hidden',
                                            }}
                                        onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const selectedImage = e.target.files[0] as File;
                                            setReceiptImage(selectedImage);
                                            console.log(selectedImage);
                                            
                                        }
                                        }}
                                    />
                                </Button>
                            </div>
                        </div>
                </div>:
                <div className='w-[86%] flex flex-col items-center'>
                    <div className='w-full flex justify-between mt-2'>
                        <ListItemPrefix>
                            <Avatar variant="square" className="p-1" alt="candice" src={`.png`} />
                        </ListItemPrefix>
                        <div className="w-full flex justify-between">
                            <div className='flex items-center'>
                                <Typography variant="h6" color="blue-gray">
                                    영화관
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="green" className="text-end">
                                3,000원
                                </Typography>
                                <Typography variant="small" color="blue-gray" className="font-normal text-end">
                                3,000원
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center mt-6 w-full'>
                        <ToggleButton
                        className='bg-black'
                        value="check"
                        selected={analys}
                        onChange={() => {
                            setAnalys(!analys);
                        }}
                        >
                            <ExpandMoreIcon />
                        </ToggleButton>
                        <div className='ml-4 font-bold'>
                        결재 내역 분석하기
                        </div>
                    </div>
                    {analys? 
                    <div className='border-blue-gray-100 rounded-xl border mt-5 flex flex-col items-center w-full '>
                        <div className='mt-11 font-bold'>아직 분석한 결제 내역이 없습니다.</div>
                        <div className='mt-10 mb-6'>
                        <Button color="blue" onClick={() => document.getElementById('file-input')?.click()}>영수증 등록</Button>
                            <input
                                type="file"
                                id="file-input"
                                accept="image/*"
                                style={{
                                    position: 'absolute',
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                    overflow: 'hidden',
                                }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const selectedImage = e.target.files[0] as File;
                                        setReceiptImage(selectedImage);
                                        console.log(selectedImage);
                                    }
                                }}
                                />
                            {/* <button onClick={receiptAnlays}>확인</button> */}
                        </div>
                    </div>: null}
                    <div className='border-blue-gray-100 rounded-xl border mt-12 w-full'>
                        <div className=' flex justify-between mt-2 mx-5'>
                            <ListItemPrefix>
                                <Avatar variant="square" className="p-1" alt="candice" src={`.png`} />
                            </ListItemPrefix>

                            <div className='flex items-center'>
                                <Typography variant="h6" color="blue-gray">
                                    카테고리: 영화관
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className='border-blue-gray-100 rounded-xl border mt-5 w-full'>
                        <Typography variant="h6" color="blue-gray" className='flex justify-between mx-4 my-4 text-lg font-bold '>
                            <div>거래 일시 :</div>
                            <div>8월 29일</div>
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className='flex justify-between mx-4 my-4 text-lg font-bold '>
                            <div>사용처 :</div>
                            <div>알빠노</div>
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className='flex justify-between mx-4 my-4 text-lg font-bold '>
                            <div>결제 수단 :</div>
                            <div>카드</div>
                        </Typography>                    
                    </div>
                    <div className='border-blue-gray-100 rounded-xl border mt-5 w-full mb-28'>
                        <Typography variant="h6" color="blue-gray" className='flex justify-between mx-4 my-4 text-m font-bold  '>
                            최근 3개월간 거래 내역
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className='flex justify-between mx-4 my-4 text-m font-bold w-[90%] text-blue-gray-500 '>
                            <div>거래 횟수:</div>
                            <div>총 거래 금액:</div>
                        </Typography>
                    </div>
                </div>
                } 
        </div>
    );
};

export default HistoryDetail;
