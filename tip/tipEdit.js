import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import command from './tipCommand';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

export default class tipEdit extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add('tip', new command(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    schema.register('editItemBox', {
      isObject: true,
      allowWhere: '$block',
    })

    schema.register('tipContentBox', {
      allowWhere: '$block',
      isLimit: true,
      allowIn: 'editItemBox',
    })

    schema.register('tipTitle', {
      isLimit: true,
      allowIn: 'tipContentBox',
      isObject: true,
      allowContentOf: '$root'
    })

    schema.register('tipContent', {
      isLimit: true,
      allowIn: 'tipContentBox',
      isObject: true,
      allowContentOf: '$root'
    })

    schema.register('tipClose', {
      isLimit: true,
      allowIn: 'tipContentBox',
      allowContentOf: '$block'
    });


    schema.register('tipSpan', {
      isLimit: true,
      allowIn: 'tipClose',
      allowContentOf: '$block'
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    conversion.for('editingDowncast').elementToElement({
      model: 'editItemBox',
      view: (modelItem, viewWriter) => {
        const viewWrapper = viewWriter.createContainerElement('div');
        viewWriter.addClass('edit-item-box', viewWrapper);
        return toHorizontalLineWidget(viewWrapper, viewWriter);
      }
    });

    conversion.elementToElement({
      model: 'tipContentBox',
      view: {
        name: 'div',
        classes: 'tip-content-box'
      }
    });

    conversion.elementToElement({
      model: 'tipClose',
      view: {
        name: 'div',
        classes: 'close'
      }
    });

    conversion.elementToElement({
      model: 'tipSpan',
      view: {
        name: 'span',
        classes: 'closeIcon'
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'tipTitle',
      view: (modelItem, writer) => {
        const nested = writer.createEditableElement('div', { class: 'tip-title' });
        writer.setAttribute('contenteditable', nested.isReadOnly ? 'false' : 'true', nested);
        nested.on('change:isReadOnly', (evt, property, is) => {
          writer.setAttribute('contenteditable', is ? 'false' : 'true', nested);
        });
        return nested;
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'tipContent',
      view: (modelItem, writer) => {
        const nested = writer.createEditableElement('div', { class: 'tip-content' });
        writer.setAttribute('contenteditable', nested.isReadOnly ? 'false' : 'true', nested);
        nested.on('change:isReadOnly', (evt, property, is) => {
          writer.setAttribute('contenteditable', is ? 'false' : 'true', nested);
        });
        return nested;
      }
    });

  }
}


function toHorizontalLineWidget(viewElement, writer, label) {
  writer.setCustomProperty('tip', true, viewElement);
  return toWidget(viewElement, writer, { label });
}