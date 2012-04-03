var scheduleMock = {
    status: 200,
    responseText: '\
<?xml version="1.0" encoding="UTF-8"?>\
<reminder>\
    <schedule>\
        <id>schedule:213860:2012-04-01 13:30:00</id>\
        <updated>2012-04-01 13:16:44</updated>\
        <title>test</title>\
        <memo></memo>\
        <link>https://test.jp/cgi-bin/cbgrn/grn.cgi/schedule/view?event=1&amp;nid=1#follow</link>\
        <startdate>2012-04-01 13:30:00</startdate>\
        <enddate>2012-04-01 23:45:00</enddate>\
        <facility>場所1</facility>\
    </schedule>\
    <schedule>\
        <id>schedule:213195:2012-04-02 14:00:00</id>\
        <updated>2012-03-30 12:44:41</updated>\
        <title>title MTG</title>\
        <memo>MTGです。\
        </memo>\
        <link>https://test.jp/cgi-bin/cbgrn/grn.cgi/schedule/view?event=1&amp;nid=1#follow</link>\
        <startdate>2012-04-02 14:00:00</startdate>\
        <enddate>2012-04-02 15:00:00</enddate>\
        <facility>場所2</facility>\
    </schedule>\
</reminder>'
}
