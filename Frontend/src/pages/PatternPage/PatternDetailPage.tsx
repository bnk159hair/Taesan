import React, { useEffect } from 'react';
import DetailList from 'components/PatternDetail/DetailList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from 'store/UserStore';
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const PatternDetailPage = () => {
  const { accessToken, refreshToken, connectedAsset, createdTikkle } = useUserStore();
  const navigate = useNavigate();
  const tokenCheck = () => {
    axios
      .post(
        '/api/member-management/members/check/access-token',
        {},
        {
          headers: {
            'ACCESS-TOKEN': accessToken,
            'REFRESH-TOKEN': refreshToken,
          },
        },
      )
      .then((res) => {
        if (res.data.response === false) {
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
        navigate('/');
      });
  };
  useEffect(() => {
    tokenCheck();
    if (connectedAsset === false) {
      navigate('/main');
    }
  }, []);
  return (
    <div>
      <DetailList />
    </div>
  );
};

export default PatternDetailPage;
