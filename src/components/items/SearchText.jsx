import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import { green } from '@ant-design/colors';

const SearchText = (props) => {
  const {
    className = '',
    searchText = '',
    value = '',
  } = props;

  const { t } = useTranslation()

  const results = useMemo(() => {
    if (searchText && value) {
      const results = []
      const splitTexts = value.toLowerCase().split(searchText.toLowerCase())
      const texts = [];
      splitTexts.forEach((text, i) => {
        texts.push(text);
        if (i < splitTexts.length - 1 ) {
          texts.push(searchText.toLowerCase());
        }
      });
      let sliceIndex = 0
      for (let i = 0; i < texts.length; i++) {
        results.push({
          text: value.slice(sliceIndex, sliceIndex + texts[i].length),
          isSearch: texts[i] === searchText.toLowerCase()
        })
        sliceIndex += texts[i].length
      }
      return results
    }
    return []
  }, [value, searchText])

  return (
    <p className={className}>
      {
        results.map((r, index) => <span key={index}>
          {
            r.isSearch ? <span
              style={{ backgroundColor: green[2] }}
            >{r.text}</span> : <span>{r.text}</span>
          }
        </span>)
      }
    </p>
  );
}

export default SearchText;