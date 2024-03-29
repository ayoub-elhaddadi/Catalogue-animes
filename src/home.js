import './style/home.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Link } from 'react-router-dom';

import BtnFavoris from './components/BtnFavoris';
                                              

function Home() {
  const API_URL = 'https://kitsu.io/api/edge/anime';
  const [animes, setAnimes] = useState([]);
  const [api, setApi] = useState(API_URL);

  const [selectedSeasonYear, setSelectedSeasonYear] = useState(null);
  const [selectedAgeRating, setSelectedAgeRating] = useState(null);
  const [currentPaginator, setCurrentPaginator] = useState(0);

  const seasonYearsList = [];
  for(let i=2023 ; i>1980 ; i--) seasonYearsList.push(i);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(api);
      setAnimes(res.data.data);
    };
    fetchData();   
  }, [api]);

  const ageList = [
    {name: 'Mild Nudity	', code: 'G'},
    {name: 'Children', code: 'PG'},
    {name: 'Teens 13 or older	', code: 'R'},
    {name: '17+ (violence & profanity)', code: 'R18'},
  ];

  const linkAnime = (anime) => {
    return (
      <Link to={`/anime/${anime.id}`}>
        Voir details
      </Link>
    );
  };

  const onChangeSeasonYear = (e)  => {
    setSelectedSeasonYear(e.value);
    setCurrentPaginator(0);
    setSelectedAgeRating('');
    setApi(`${API_URL}?filter[seasonYear]=${e.value}`);
  };
  
  const onChangeAgeRating = (e) => {
    setSelectedAgeRating(e.value);
    setSelectedSeasonYear(0);
    setCurrentPaginator(0);
    setSelectedSeasonYear(0);
    setApi(`${API_URL}?filter[ageRating]=${e.value}`);
  }

  const onEnterSearch = (e) => {
    if (e.key === 'Enter') {
      setApi(`${API_URL}?filter[text]=${e.target.value.replace(' ','%20')}`);
    }
  }

  const onBasicPageChange = (e) => {
    setCurrentPaginator(e.first);
    setApi(`${API_URL}?page[limit]=10&page[offset]=${e.first}`);
  };

  return (
    <div className='container'>
      <div className="card flex flex-wrap justify-content-center gap-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Recherche anime" onKeyDown={onEnterSearch}/>
        </span>
        <span className="p-input search">
          <Dropdown value={selectedSeasonYear} onChange={onChangeSeasonYear} options={seasonYearsList} 
          placeholder="Année" className="p-dropdown-outlined" />
        </span>
        <span className="p-dropdown-outlined dropDown">
          <Dropdown value={selectedAgeRating} onChange={onChangeAgeRating} options={ageList} 
          optionLabel="name" optionValue='code' placeholder="Age Recommandé" className="p-dropdown-outlined"  />
        </span>
      </div>
      <div className="card">
          <h3 className='title'>Catalogue</h3>
            <DataTable value={animes} responsiveLayout="scroll" className='table'>
                <Column field="attributes.canonicalTitle" header="Titre" sortable></Column>
                <Column field="attributes.titles.ja_jp" header="Titre Japonais" sortable></Column>
                <Column field="attributes.ageRatingGuide" header="Age Recommendé" sortable></Column>
                <Column field="attributes.ratingRank" header="Rang" sortable></Column>
                <Column field="id" header="" body={linkAnime}></Column>
          </DataTable>
          <Paginator first={currentPaginator} rows={10} totalRecords={1200} onPageChange={onBasicPageChange}></Paginator>
      </div>
      <div className='btnFavoris'>
        <BtnFavoris />
      </div>
    </div>
  );
}

export default Home;
