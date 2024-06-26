import { useEffect } from "react";
import styled from "styled-components";
import Filter from "../components/Filter/Filter";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { darkTheme, lightTheme, media } from "../GlobalStyles";
import {
  fetchCountries,
  selectCountries,
  selectIsLoading,
} from "../redux/slices/countries";
import { selectNameFilter, selectRegionFilter } from "../redux/slices/filter";
import { Link } from "react-router-dom";
import { selectTheme } from "../redux/slices/theme";
import { StyledProps } from "../sharedTypes/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Main = styled.main<StyledProps>`
  @media (${media.mobile}) {
    padding: 0px 30px;
  }
  padding: 0px 70px;
  padding-bottom: 50px;
  min-height: calc(100vh - 100px);
  background-color: ${(props) =>
    props.$theme === "light"
      ? lightTheme.colors.lightGrey
      : darkTheme.colors.veryDarkBlue};
`;

const Countries = styled.div`
  @media (${media.mobile}) {
    display: flex;
    flex-direction: column;
  }
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
  justify-content: space-between;
  row-gap: 50px;
  column-gap: 20px;
`;

const NoMatches = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
  font-size: 2em;
`;

const Homepage = () => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();
  const nameFilter = useAppSelector(selectNameFilter);
  const regionFilter = useAppSelector(selectRegionFilter);
  const countries = useAppSelector(selectCountries);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (countries.length) return;
    dispatch(fetchCountries("https://restcountries.com/v3.1/all"));
  }, []);

  const filteredCountries = countries?.filter(
    ({ name, region }) =>
      name.official.toLowerCase().includes(nameFilter.toLowerCase()) &&
      region.toLowerCase().includes(regionFilter.toLowerCase())
  );
  const renderCountriesCards = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (!isLoading && !countries.length) {
      return <Error message={"Lost connection with API server"} />;
    }
    if (!isLoading && !filteredCountries.length) {
      return <NoMatches>No matches with the filter </NoMatches>;
    }
    return (
      <Countries>
        {filteredCountries.length &&
          filteredCountries.map((country) => (
            <Link
              style={{ textDecoration: "none" }}
              key={country.name.official}
              to={country.name.common.toLowerCase()}
            >
              <Card {...country} />
            </Link>
          ))}
      </Countries>
    );
  };

  return (
    <>
      <Filter />
      <Main $theme={theme}>{renderCountriesCards()}</Main>
    </>
  );
};

export default Homepage;
