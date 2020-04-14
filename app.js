import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import tip from './tip/tip'
import MouseEventsObserver from '@ckeditor/ckeditor5-table/src/tableselection/mouseeventsobserver';

ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [Essentials, Paragraph, Bold, tip, Italic],
    toolbar: ['bold', 'italic', 'tip']
  })
  .then(editor => {
    const view = editor.editing.view;
    view.addObserver(MouseEventsObserver);
    // delete event
    editor.editing.view.document.on('click', (evt, data) => {
      if (data.domTarget.className == 'closeIcon' || data.domTarget.className == 'close') {
        const selection = editor.model.document.selection;
        editor.model.document.model.deleteContent(selection)
      };
    });
    let currentElement = null;

    editor.editing.view.document.on('mousemove', (evt, data) => {
      if (data.domTarget.offsetParent.className == 'tip-content-box' || data.domTarget.className == 'tip-content') {
        let top = data.domTarget.offsetParent.offsetTop;
        let left = data.domTarget.offsetParent.offsetLeft + data.domTarget.offsetParent.offsetWidth;
        let testClose = document.getElementById('testClose');
        testClose.style.top = top + 'px';
        testClose.style.left = left - 10 + 'px';
      } else if (data.domTarget.className.indexOf('ck-content') != -1) {
        let testClose = document.getElementById('testClose');
        testClose.style.top = '-1000px';
        testClose.style.left = '-1000px';
      }
    });

    document.getElementById('testClose').addEventListener('click', (evt, data) => {
      const selection = editor.model.document.selection;
      // delete & hide close icon
      editor.model.document.model.deleteContent(selection)
      let testClose = document.getElementById('testClose');
      testClose.style.top = '-1000px';
      testClose.style.left = '-1000px';
    })

    document.getElementById('deleteBtn').addEventListener('click', function(e) {
      // const selection = editor.model.document.selection;
      // editor.model.document.model.deleteContent(selection)

      editor.model.change(writer => {
        const root = editor.model.document.getRoot();
        const range = writer.createRangeIn(root);

        for (const value of range.getWalker()) {
          if (value.item.is('element') ){
            if (value.item.name == 'editItemBox') {
              writer.remove(value.item);
            }
          }
        }
      });

      // for (const value of range.getWalker()) {
      //   if (value.item.is('image')) {
      //     const itemId = value.item.getAttribute('id');
      //     if (itemId == 'foo') {
      //       writer.remove(value.item);
      //     }
      //   }
      // }

    })
  })
  .catch(error => {
    console.error(error.stack);
  });