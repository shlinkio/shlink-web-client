import { FC, useEffect, useState } from 'react';
import { InputType } from 'reactstrap/types/lib/Input';
import { Button, FormGroup, Input, Row } from 'reactstrap';
import { cond, isEmpty, pipe, replace, trim, T } from 'ramda';
import classNames from 'classnames';
import { parseISO } from 'date-fns';
import DateInput, { DateInputProps } from '../utils/DateInput';
import { supportsCrawlableVisits, supportsForwardQuery, supportsShortUrlTitle } from '../utils/helpers/features';
import { SimpleCard } from '../utils/SimpleCard';
import { handleEventPreventingDefault, hasValue, OptionalString } from '../utils/utils';
import Checkbox from '../utils/Checkbox';
import { SelectedServer } from '../servers/data';
import { TagsSelectorProps } from '../tags/helpers/TagsSelector';
import { DomainSelectorProps } from '../domains/DomainSelector';
import { formatIsoDate } from '../utils/helpers/date';
import UseExistingIfFoundInfoIcon from './UseExistingIfFoundInfoIcon';
import { ShortUrlData } from './data';
import { ShortUrlFormCheckboxGroup } from './helpers/ShortUrlFormCheckboxGroup';
import './ShortUrlForm.scss';

export type Mode = 'create' | 'create-basic' | 'edit';

type DateFields = 'validSince' | 'validUntil';
type NonDateFields = 'longUrl' | 'customSlug' | 'shortCodeLength' | 'domain' | 'maxVisits' | 'title';

export interface ShortUrlFormProps {
  mode: Mode;
  saving: boolean;
  initialState: ShortUrlData;
  onSave: (shortUrlData: ShortUrlData) => Promise<unknown>;
  selectedServer: SelectedServer;
}

const normalizeTag = pipe(trim, replace(/ /g, '-'));
const toDate = (date?: string | Date): Date | undefined => typeof date === 'string' ? parseISO(date) : date;
const dynamicColClasses = (flag: boolean) => ({ 'col-sm-6': flag, 'col-sm-12': !flag });

export const ShortUrlForm = (
  TagsSelector: FC<TagsSelectorProps>,
  DomainSelector: FC<DomainSelectorProps>,
): FC<ShortUrlFormProps> => ({ mode, saving, onSave, initialState, selectedServer }) => {
  const [ shortUrlData, setShortUrlData ] = useState(initialState);
  const isEdit = mode === 'edit';
  const isBasicMode = mode === 'create-basic';
  const hadTitleOriginally = hasValue(initialState.title);
  const changeTags = (tags: string[]) => setShortUrlData({ ...shortUrlData, tags: tags.map(normalizeTag) });
  const reset = () => setShortUrlData(initialState);
  const resolveNewTitle = (): OptionalString => {
    const hasNewTitle = hasValue(shortUrlData.title);
    const matcher = cond<never, OptionalString>([
      [ () => !hasNewTitle && !hadTitleOriginally, () => undefined ],
      [ () => !hasNewTitle && hadTitleOriginally, () => null ],
      [ T, () => shortUrlData.title ],
    ]);

    return matcher();
  };
  const submit = handleEventPreventingDefault(async () => onSave({
    ...shortUrlData,
    validSince: formatIsoDate(shortUrlData.validSince) ?? null,
    validUntil: formatIsoDate(shortUrlData.validUntil) ?? null,
    maxVisits: !hasValue(shortUrlData.maxVisits) ? null : Number(shortUrlData.maxVisits),
    title: resolveNewTitle(),
  }).then(() => !isEdit && reset()).catch(() => {}));

  useEffect(() => {
    setShortUrlData(initialState);
  }, [ initialState ]);

  const renderOptionalInput = (
    id: NonDateFields,
    placeholder: string,
    type: InputType = 'text',
    props = {},
    fromGroupProps = {},
  ) => (
    <FormGroup {...fromGroupProps}>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={shortUrlData[id] ?? ''}
        onChange={(e) => setShortUrlData({ ...shortUrlData, [id]: e.target.value })}
        {...props}
      />
    </FormGroup>
  );
  const renderDateInput = (id: DateFields, placeholder: string, props: Partial<DateInputProps> = {}) => (
    <DateInput
      selected={shortUrlData[id] ? toDate(shortUrlData[id] as string | Date) : null}
      placeholderText={placeholder}
      isClearable
      onChange={(date) => setShortUrlData({ ...shortUrlData, [id]: date })}
      {...props}
    />
  );
  const basicComponents = (
    <>
      <FormGroup>
        <Input
          bsSize="lg"
          type="url"
          placeholder="URL to be shortened"
          required
          value={shortUrlData.longUrl}
          onChange={(e) => setShortUrlData({ ...shortUrlData, longUrl: e.target.value })}
        />
      </FormGroup>
      <Row>
        {isBasicMode && renderOptionalInput('customSlug', 'Custom slug', 'text', { bsSize: 'lg' }, { className: 'col-lg-6' })}
        <div className={isBasicMode ? 'col-lg-6' : 'col-12 mb-0'}>
          <TagsSelector selectedTags={shortUrlData.tags ?? []} onChange={changeTags} />
        </div>
      </Row>
    </>
  );

  const supportsTitle = supportsShortUrlTitle(selectedServer);
  const showCustomizeCard = supportsTitle || !isEdit;
  const limitAccessCardClasses = classNames('mb-3', dynamicColClasses(showCustomizeCard));
  const showCrawlableControl = supportsCrawlableVisits(selectedServer);
  const showForwardQueryControl = supportsForwardQuery(selectedServer);
  const showBehaviorCard = showCrawlableControl || showForwardQueryControl;
  const extraChecksCardClasses = classNames('mb-3', dynamicColClasses(showBehaviorCard));

  return (
    <form className="short-url-form" onSubmit={submit}>
      {isBasicMode && basicComponents}
      {!isBasicMode && (
        <>
          <SimpleCard title="Basic options" className="mb-3">
            {basicComponents}
          </SimpleCard>

          <Row>
            {showCustomizeCard && (
              <div className="col-sm-6 mb-3">
                <SimpleCard title="Customize the short URL">
                  {supportsTitle && renderOptionalInput('title', 'Title')}
                  {!isEdit && (
                    <>
                      <Row>
                        <div className="col-lg-6">
                          {renderOptionalInput('customSlug', 'Custom slug', 'text', {
                            disabled: hasValue(shortUrlData.shortCodeLength),
                          })}
                        </div>
                        <div className="col-lg-6">
                          {renderOptionalInput('shortCodeLength', 'Short code length', 'number', {
                            min: 4,
                            disabled: hasValue(shortUrlData.customSlug),
                          })}
                        </div>
                      </Row>
                      <DomainSelector
                        value={shortUrlData.domain}
                        onChange={(domain?: string) => setShortUrlData({ ...shortUrlData, domain })}
                      />
                    </>
                  )}
                </SimpleCard>
              </div>
            )}

            <div className={limitAccessCardClasses}>
              <SimpleCard title="Limit access to the short URL">
                {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
                <div className="mb-3">
                  {renderDateInput('validSince', 'Enabled since...', { maxDate: shortUrlData.validUntil ? toDate(shortUrlData.validUntil) : undefined })}
                </div>
                {renderDateInput('validUntil', 'Enabled until...', { minDate: shortUrlData.validSince ? toDate(shortUrlData.validSince) : undefined })}
              </SimpleCard>
            </div>
          </Row>

          <Row>
            <div className={extraChecksCardClasses}>
              <SimpleCard title="Extra checks">
                <ShortUrlFormCheckboxGroup
                  infoTooltip="If checked, Shlink will try to reach the long URL, failing in case it's not publicly accessible."
                  checked={shortUrlData.validateUrl}
                  onChange={(validateUrl) => setShortUrlData({ ...shortUrlData, validateUrl })}
                >
                  Validate URL
                </ShortUrlFormCheckboxGroup>
                {!isEdit && (
                  <p>
                    <Checkbox
                      inline
                      className="me-2"
                      checked={shortUrlData.findIfExists}
                      onChange={(findIfExists) => setShortUrlData({ ...shortUrlData, findIfExists })}
                    >
                      Use existing URL if found
                    </Checkbox>
                    <UseExistingIfFoundInfoIcon />
                  </p>
                )}
              </SimpleCard>
            </div>
            {showBehaviorCard && (
              <div className="col-sm-6 mb-3">
                <SimpleCard title="Configure behavior">
                  {showCrawlableControl && (
                    <ShortUrlFormCheckboxGroup
                      infoTooltip="This short URL will be included in the robots.txt for your Shlink instance, allowing web crawlers (like Google) to index it."
                      checked={shortUrlData.crawlable}
                      onChange={(crawlable) => setShortUrlData({ ...shortUrlData, crawlable })}
                    >
                      Make it crawlable
                    </ShortUrlFormCheckboxGroup>
                  )}
                  {showForwardQueryControl && (
                    <ShortUrlFormCheckboxGroup
                      infoTooltip="When this short URL is visited, any query params appended to it will be forwarded to the long URL."
                      checked={shortUrlData.forwardQuery}
                      onChange={(forwardQuery) => setShortUrlData({ ...shortUrlData, forwardQuery })}
                    >
                      Forward query params on redirect
                    </ShortUrlFormCheckboxGroup>
                  )}
                </SimpleCard>
              </div>
            )}
          </Row>
        </>
      )}

      <div className="text-center">
        <Button
          outline
          color="primary"
          disabled={saving || isEmpty(shortUrlData.longUrl)}
          className="btn-xs-block"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};
