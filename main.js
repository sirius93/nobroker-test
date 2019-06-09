(() => {
    makeAjax = (url) => {
        return fetch(url).then(res => res.json());
    }

    const productsUrl = 'https://demo8808386.mockable.io/fetchProperties';

    let ProprtiesData = [];

    let filteredProprtiesArray = [];


    let lastSort = null;

    let slide1,slide2,slide3,slide4;

    makeAjax(productsUrl)
        .then(res => ProprtiesData = res.data)
        .then(() => {
            filteredProprtiesArray = [...ProprtiesData];
            renderProprties(filteredProprtiesArray);
        })
        .catch(err => console.log(err));

    // Proprties

    renderProprties = (arr) => {
        const mainContainer = document.querySelector('.property-wrapper');
        mainContainer.innerHTML = null;
        arr.forEach((property,index) => {
            mainContainer.appendChild(createProperty(property, mainContainer));
        });
        initCarousel();
    }


    createProperty = (item, mainContainer) => {
        let Dates = new Date(item.creationDate);

        const container = document.createElement('div');
        container.setAttribute('class', 'item-wrapper');

        const imageContainer = document.createElement('div');
        imageContainer.setAttribute('class', 'image-wrapper');

        if(item.photos.length > 0){
            item.photos.forEach((photo)=> {
                const image = document.createElement('img');
                image.setAttribute('src', `https://images.nobroker.in/images/${item.id}/${photo.imagesMap.large}`);
                imageContainer.appendChild(image);
            } )
        }else{
            const image = document.createElement('img');
            image.setAttribute('src', `https://images.nobroker.in/static/img/resale/1bhk.jpg`);
            imageContainer.appendChild(image);
        }
        
        container.appendChild(imageContainer);

        const textContainer = document.createElement('div');
        textContainer.setAttribute('class', 'text-wrapper');

        const heading = document.createElement('a');
        heading.setAttribute('class', 'heading');
        heading.setAttribute('href', item.shortUrl);
        heading.setAttribute('target', '_blank');
        heading.innerHTML = `${item.propertyTitle} <br/>`;

        textContainer.appendChild(heading);
        container.appendChild(textContainer)

        const priceTag = document.createElement('span');
        priceTag.setAttribute('class', 'price-tag');
        priceTag.innerHTML = `Rent : &#x20b9; ${item.rent} <br/>
                              Depost : &#x20b9; ${item.deposit} <br/>
                              Size : SqFt ${item.propertySize}<br/>
                              Creation Date: ${Dates.getDate()}/${Dates.getMonth()}/${Dates.getFullYear()}`;

        textContainer.appendChild(priceTag);


        return container;
    }


    sortProducts = (option) => {
        lastSort = option;
        switch (option) {
            case 'Relevance':
                renderProprties(ProprtiesData);
                break;
            case 'Rent - Low to High':
                filteredProprtiesArray.sort(lowToHighRent);
                renderProprties(filteredProprtiesArray);
                break;
            case 'Rent - High to Low':
                filteredProprtiesArray.sort(highToLowRent);
                renderProprties(filteredProprtiesArray);
                break;
            case 'Size - Low to High':
                filteredProprtiesArray.sort(lowToHighSize);
                renderProprties(filteredProprtiesArray);
                break;
            case 'Size - High to Low':
                filteredProprtiesArray.sort(highToLowSize);
                renderProprties(filteredProprtiesArray);
                break; 
            case 'Date - High to Low':
                filteredProprtiesArray.sort(highToLowDate);
                renderProprties(filteredProprtiesArray);
                break;
            case 'Date - Low to High':
                filteredProprtiesArray.sort(lowToHighDate);
                renderProprties(filteredProprtiesArray);
                break;       
        }
    }

    lowToHighRent = (a, b) => {
        return a.rent - b.rent     
    }

    highToLowRent = (a, b) => {
        return b.rent - a.rent 
    }

    lowToHighSize = (a,b) => {
        return a.propertySize - b.propertySize
    }

    highToLowSize = (a,b) => {
        return b.propertySize - a.propertySize
    }

    lowToHighDate = (a,b) => {
        let d1 = new Date(a.creationDate),
            d2 = new Date(b.creationDate);
        return d1 - d2
    }

    highToLowDate = (a,b) => {
        let d1 = new Date(a.creationDate),
            d2 = new Date(b.creationDate);
        return d2-d1
    }
    

    addListenersToSortOptions = () => {
        const buttons = document.querySelectorAll('.sort');
        buttons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                buttons.forEach(button => button.classList.remove('selected'));
                btn.classList.add('selected');
                sortProducts(btn.innerHTML);
            })
        })

    }


    getVals = (that) => {
        let slides = document.getElementsByName('rent');
            slidesPropSize = document.getElementsByName('propertySize');
   
        slide1 = parseFloat(slides[0].value),
        slide2 = parseFloat(slides[1].value);

        slide3 = parseFloat(slidesPropSize[0].value),
        slide4 = parseFloat(slidesPropSize[1].value)

        
        if (slide1 > slide2) {
            let tmp = slide2;
            slide2 = slide1;
            slide1 = tmp;
        }

        if (slide3 > slide4) {
            let tmp = slide4;
            slide4 = slide3;
            slide3 = tmp;
        }

        const displayElement = document.getElementsByClassName('rangeValues')[0];
        const displayElement2 = document.getElementsByClassName('rangeValues')[1];
        displayElement.innerHTML = '&#x20b9;' + slide1 + '- &#x20b9;' + slide2+ '<br/>';
        displayElement2.innerHTML = slide3+' SqFt'+'  '+ slide4+' SqFt'+ '<br/>';
        filtersData(slide1,slide2,slide3,slide4);
    }

    filtersData = (a,b,c,d) => {
        if (ProprtiesData.length > 0) {
            if(isCheckboxEnabled()){
                filteredProprtiesArray = ProprtiesData.filter(property => property.rent >= a && property.rent <= b && property.photos.length > 0 && property.propertySize >= c && property.propertySize <= d );
            } else {
                filteredProprtiesArray = ProprtiesData.filter(property => property.rent >= a && property.rent <= b && property.propertySize >= c && property.propertySize <= d);
            }
            
            const numberOfProducts = filteredProprtiesArray.length;
            document.querySelector('.result-header').innerHTML = `Showing ${numberOfProducts} results for 'Houses'`
            sortProducts(lastSort)
            renderProprties(filteredProprtiesArray);
        }    
    }

    initiateSliders = () => {
        const sliderSections = document.getElementsByClassName('range-slider');
        
        for (let x = 0; x < sliderSections.length; x++) {
            let sliders = sliderSections[x].getElementsByTagName('input');
            for (let y = 0; y < sliders.length; y++) {
                if (sliders[y].type === 'range') {
                    sliders[y].oninput = getVals(sliders[y]);
                    getVals(sliders[y]);
                }
            }
        }
    }

    isCheckboxEnabled = () => {
        const checkbox = document.getElementById('photocheckbox');

        let isPhotoAvailable = false;

        if(checkbox.checked === true){
            isPhotoAvailable = true;
        }

        return isPhotoAvailable;
    }

    addListenerOnCheckBox = () => {
        const checkbox = document.getElementById('photocheckbox');
        checkbox.addEventListener('click', (event) => {
            filtersData(slide1,slide2,slide3,slide4);
        })
    }

    addListenerOnFilterButton = () => {
        const filterbutton = document.getElementsByClassName('filter-button')[0];
        filterbutton.addEventListener('click', (event)=> {
            const filter = document.getElementsByClassName('filters')[0];
            if(filter.classList.value.indexOf('show') > -1){
                filter.className = 'filters';
            }else{
                filter.className += ' show'
            }
            
        })
    }

    addListenerOnResetButton = () => {
        const resetBtn = document.getElementsByClassName('ResetButton')[0];
        resetBtn.addEventListener('click', () => {
            const checkbox = document.getElementById('photocheckbox');
            const displayElement = document.getElementsByClassName('rangeValues')[0];
            const displayElement2 = document.getElementsByClassName('rangeValues')[1];
            const rangeElements = document.getElementsByTagName('input');

            slide1 = 8000;
            slide2 = 50000;
            slide3 = 500;
            slide4 = 2500;
            checkbox.checked = true ? false : true;
            displayElement.innerHTML = '&#x20b9;' + slide1 + '- &#x20b9;' + slide2+ '<br/>';
            displayElement2.innerHTML = slide3+' SqFt'+'  '+ slide4+' SqFt'+ '<br/>';
            rangeElements[0].value = slide1;
            rangeElements[1].value = slide2;
            rangeElements[2].value = slide3;
            rangeElements[3].value = slide4;
        

            filtersData(slide1,slide2,slide3,slide4);
        })
    }

    addListenersOnViewButtons = () => {
        const listBtn = document.querySelector('.list-view'),
        gridBtn = document.querySelector('.grid-view'),
        mainContainer = document.querySelector('.property-wrapper');

        listBtn.addEventListener('click',(event) => {
            event.target.className += " selected";
            mainContainer.className += " list";
            gridBtn.classList.remove("selected");
            mainContainer.classList.remove("grid");
        });
        gridBtn.addEventListener('click',(event) => {
            event.target.className += " selected";
            mainContainer.className += " grid";
            listBtn.classList.remove("selected");
            mainContainer.classList.remove("list");
        })
    }

    initCarousel = () => {
        $('.image-wrapper').slick({
            infinite: true,
            speed: 50,
            fade: true,
            cssEase: 'linear'
        });
    }


    addListenersToSortOptions();
    initiateSliders();
    addListenerOnCheckBox();
    addListenerOnFilterButton();
    addListenerOnResetButton();
    addListenersOnViewButtons();
})();
